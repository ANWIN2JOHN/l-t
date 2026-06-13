import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { foundItemService, CreateFoundItemPayload } from "../services/foundItemService";
import { toast } from "sonner";

export const FOUND_ITEMS_QUERY_KEY = ["found-items"];
export const BROWSE_FOUND_ITEMS_QUERY_KEY = ["browse-found-items"];

export function useCreateFoundItem() {
const queryClient = useQueryClient();

return useMutation({
mutationFn: (data: CreateFoundItemPayload) =>
foundItemService.createFoundItem(data),

onSuccess: () => {
  toast.success("Found item reported successfully!");

  queryClient.invalidateQueries({
    queryKey: FOUND_ITEMS_QUERY_KEY,
  });

  queryClient.invalidateQueries({
    queryKey: BROWSE_FOUND_ITEMS_QUERY_KEY,
  });

  queryClient.invalidateQueries({
    queryKey: ["dashboard-stats"],
  });
},

onError: (err: any) => {
  console.error("[useCreateFoundItem] Mutation error:", err);
  toast.error(err.message || "Failed to submit found item");
},


});
}

export function useFoundItems() {
return useQuery({
queryKey: FOUND_ITEMS_QUERY_KEY,
queryFn: () => foundItemService.getFoundItems(),
});
}

export function usePublicFoundItems() {
return useQuery({
queryKey: BROWSE_FOUND_ITEMS_QUERY_KEY,
queryFn: () => foundItemService.getPublicFoundItems(),
});
}
