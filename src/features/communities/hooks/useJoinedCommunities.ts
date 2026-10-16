import { useQuery } from "@tanstack/react-query";
import { communityService } from "../services/community.service";

export const joinedCommunityQueryKey = ["communities", "joined"] as const;

export function useJoinedCommunities() {
  return useQuery({
    queryKey: joinedCommunityQueryKey,
    queryFn: async () => {
      const page = await communityService.listJoined({ page: 1, limit: 50 });
      return page.data.filter((community) => community.status === "approved");
    },
  });
}
