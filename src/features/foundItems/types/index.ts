import { FoundItem } from "@/types";

export type FoundItemInsert = Omit<
  FoundItem,
  "id" | "created_at" | "status" | "created_by" | "returned_by" | "returned_at" | "expires_at"
>;

export type FoundItemUpdate = Partial<FoundItemInsert>;
