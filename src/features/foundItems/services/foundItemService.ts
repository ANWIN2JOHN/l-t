import { supabase } from "@/services/supabase";
import { auditService } from "@/features/audit/services/auditService";
import { FoundItem } from "@/types";

export type CreateFoundItemPayload = {
  title: string;
  category: string;
  description: string;
  location_found: string;
  date_found: string;
  collectFrom: string; // we will map this to reception_id
};

export const foundItemService = {
  async createFoundItem(payload: CreateFoundItemPayload): Promise<FoundItem> {
    console.log("[createFoundItem] Payload:", payload);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const error = new Error("Not authenticated");
      console.log("[createFoundItem] Error:", error);
      throw error;
    }

    if (payload.date_found) {
      const selectedDate = new Date(payload.date_found);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        const error = new Error("Date found cannot be in the future");
        console.log("[createFoundItem] Error:", error);
        throw error;
      }
    }

    // Lookup reception ID
    const { data: reception, error: receptionError } = await supabase
      .from("receptions")
      .select("id")
      .eq("name", payload.collectFrom)
      .single();

    // If reception doesn't exist, we might need to fallback or throw.
    // Assuming the DB has these exact strings populated.
    if (receptionError || !reception) {
      const error = new Error(`Invalid collection point: ${payload.collectFrom}`);
      console.log("[createFoundItem] Error:", error);
      throw error;
    }

    const { data, error } = await supabase
      .from("found_items")
      .insert({
        title: payload.title,
        category: payload.category,
        description: payload.description,
        location_found: payload.location_found,
        date_found: payload.date_found,
        reception_id: reception.id,
        status: "AVAILABLE",
        created_by: user.id
      })
      .select()
      .single();

    console.log("[createFoundItem] Result:", data);
    console.log("[createFoundItem] Error:", error);

    if (error) throw error;

    void auditService.logAction(
  "CREATE_FOUND_ITEM",
  "found_item",
  data.id
);

// Trigger Intelligent Matching Engine
import("@/features/matching/services/matchingService")
  .then(({ matchingService }) => {
    void matchingService.findPotentialMatches();
  })
  .catch((err) => {
    console.error(
      "[Matching Engine] Failed to generate matches after found item creation:",
      err
    );
  });

return data;
  },

  async getFoundItems(): Promise<FoundItem[]> {
    const { data, error } = await supabase
      .from("found_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPublicFoundItems(): Promise<FoundItem[]> {
    const { data, error } = await supabase
      .from("found_items")
      .select("*")
      .eq("status", "AVAILABLE")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
};
