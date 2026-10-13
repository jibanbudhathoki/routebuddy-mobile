import { useCallback, useEffect, useRef, useState } from "react";

import { communityService } from "../services/community.service";
import type {
  Community,
  CommunityType,
  SubmitCommunityPayload,
} from "../types/community";

const PAGE_SIZE = 50;
type CommunityListKey = "approved" | "joined" | "submissions";

export function useCommunities() {
  const [approved, setApproved] = useState<Community[]>([]);
  const [joined, setJoined] = useState<Community[]>([]);
  const [submissions, setSubmissions] = useState<Community[]>([]);
  const [totals, setTotals] = useState<Record<CommunityListKey, number>>({
    approved: 0,
    joined: 0,
    submissions: 0,
  });
  const [pages, setPages] = useState<Record<CommunityListKey, number>>({
    approved: 1,
    joined: 1,
    submissions: 1,
  });
  const [types, setTypes] = useState<CommunityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState<CommunityListKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joiningUid, setJoiningUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actionInProgress = useRef(false);

  const refresh = useCallback(async (search = "") => {
    setIsRefreshing(true);
    setError(null);
    const results = await Promise.allSettled([
      communityService.listApproved({ search, page: 1, limit: PAGE_SIZE }),
      communityService.listJoined({ page: 1, limit: PAGE_SIZE }),
      communityService.listMySubmissions({ page: 1, limit: PAGE_SIZE }),
      communityService.getTypes(),
    ]);
    const failures: string[] = [];
    const [approvedResult, joinedResult, submissionsResult, typesResult] =
      results;

    if (approvedResult.status === "fulfilled") {
      setApproved(approvedResult.value.data);
      setTotals((current) => ({
        ...current,
        approved: approvedResult.value.meta.total,
      }));
      setPages((current) => ({ ...current, approved: 1 }));
    } else {
      failures.push(getErrorMessage(approvedResult.reason));
    }
    if (joinedResult.status === "fulfilled") {
      setJoined(joinedResult.value.data);
      setTotals((current) => ({
        ...current,
        joined: joinedResult.value.meta.total,
      }));
      setPages((current) => ({ ...current, joined: 1 }));
    } else {
      failures.push(getErrorMessage(joinedResult.reason));
    }
    if (submissionsResult.status === "fulfilled") {
      setSubmissions(submissionsResult.value.data);
      setTotals((current) => ({
        ...current,
        submissions: submissionsResult.value.meta.total,
      }));
      setPages((current) => ({ ...current, submissions: 1 }));
    } else {
      failures.push(getErrorMessage(submissionsResult.reason));
    }
    if (typesResult.status === "fulfilled") {
      setTypes(typesResult.value);
    } else {
      failures.push(getErrorMessage(typesResult.reason));
    }
    setError(failures.length ? failures.join("\n") : null);
    setIsLoading(false);
    setIsRefreshing(false);
    return failures.length === 0;
  }, []);

  const searchApproved = useCallback(async (search: string) => {
    try {
      const result = await communityService.listApproved({
        search,
        page: 1,
        limit: PAGE_SIZE,
      });
      setApproved(result.data);
      setTotals((current) => ({ ...current, approved: result.meta.total }));
      setPages((current) => ({ ...current, approved: 1 }));
      return { success: true as const };
    } catch (failure) {
      const message = getErrorMessage(failure);
      setError(message);
      return { success: false as const, error: message };
    }
  }, []);

  const loadMore = async (key: CommunityListKey, search = "") => {
    if (loadingMore) {
      return {
        success: false as const,
        error: "A community page is already loading.",
      };
    }
    const nextPage = pages[key] + 1;
    setLoadingMore(key);
    try {
      const result =
        key === "approved"
          ? await communityService.listApproved({
              search,
              page: nextPage,
              limit: PAGE_SIZE,
            })
          : key === "joined"
            ? await communityService.listJoined({
                page: nextPage,
                limit: PAGE_SIZE,
              })
            : await communityService.listMySubmissions({
                page: nextPage,
                limit: PAGE_SIZE,
              });
      const appendUnique = (current: Community[]) => {
        const existingUids = new Set(current.map((item) => item.uid));
        return [
          ...current,
          ...result.data.filter((item) => !existingUids.has(item.uid)),
        ];
      };
      if (key === "approved") setApproved(appendUnique);
      else if (key === "joined") setJoined(appendUnique);
      else setSubmissions(appendUnique);
      setPages((current) => ({ ...current, [key]: nextPage }));
      setTotals((current) => ({ ...current, [key]: result.meta.total }));
      return { success: true as const };
    } catch (failure) {
      return { success: false as const, error: getErrorMessage(failure) };
    } finally {
      setLoadingMore(null);
    }
  };

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const join = async (community: Community) => {
    if (actionInProgress.current) {
      return {
        success: false as const,
        error: "Another community action is in progress.",
      };
    }
    actionInProgress.current = true;
    setJoiningUid(community.uid);
    try {
      const message = await communityService.join(community.uid);
      await refresh();
      return { success: true as const, message };
    } catch (failure) {
      const message = getErrorMessage(failure);
      return { success: false as const, error: message };
    } finally {
      actionInProgress.current = false;
      setJoiningUid(null);
    }
  };

  const submit = async (payload: SubmitCommunityPayload) => {
    if (actionInProgress.current) {
      return {
        success: false as const,
        error: "Another community action is in progress.",
      };
    }
    actionInProgress.current = true;
    setIsSubmitting(true);
    try {
      const result = await communityService.submit(payload);
      await refresh();
      return { success: true as const, community: result };
    } catch (failure) {
      const message = getErrorMessage(failure);
      return { success: false as const, error: message };
    } finally {
      actionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    approved,
    joined,
    submissions,
    types,
    isLoading,
    isRefreshing,
    loadingMore,
    isSubmitting,
    joiningUid,
    error,
    refresh,
    searchApproved,
    loadMore,
    totals,
    join,
    submit,
  };
}

function getErrorMessage(failure: unknown) {
  return failure instanceof Error && failure.message
    ? failure.message
    : "Unable to load communities. Please try again.";
}
