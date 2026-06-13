import { supabase } from "@/services/supabase";

export const auditService = {
  async logAction(action: string, targetType: string, targetId?: string, metadata: Record<string, any> = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Silent return if not authenticated

      const { error } = await supabase
        .from("audit_logs")
        .insert({
          action,
          performed_by: user.id,
          target_type: targetType,
          target_id: targetId || null,
          metadata,
        });

      if (error) {
        console.error("Audit Log Error:", error);
      }
    } catch (err) {
      console.error("Failed to write audit log:", err);
    }
  }
};
