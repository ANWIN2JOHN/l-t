import { supabase } from "@/services/supabase";
import { Notification, NotificationType } from "@/types";

export const notificationService = {
  async getMyNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) throw error;
  },

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        is_read: false,
      });

    if (error) {
      console.error("Failed to create notification:", error);
      // We don't throw to prevent blocking the main workflow
    }
  }
};
