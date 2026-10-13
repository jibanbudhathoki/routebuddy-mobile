import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { useToast } from "../../../shared/components/ToastProvider";
import { CommunityList } from "../components/CommunityList";
import {
  CommunityScreenHeader,
  type CommunityTab,
} from "../components/CommunityScreenHeader";
import { CommunitySubmissionModal } from "../components/CommunitySubmissionModal";
import { useCommunities } from "../hooks/useCommunities";
import type { Community } from "../types/community";

export function CommunityScreen() {
  const { showToast } = useToast();
  const communitiesState = useCommunities();
  const [activeTab, setActiveTab] = useState<CommunityTab>("browse");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSubmissionVisible, setIsSubmissionVisible] = useState(false);
  const isInitialSearchEffect = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (isInitialSearchEffect.current) {
      isInitialSearchEffect.current = false;
      return;
    }
    if (activeTab === "browse") {
      void communitiesState.searchApproved(debouncedSearch);
    }
  }, [activeTab, debouncedSearch, communitiesState.searchApproved]);

  const listKey = activeTab === "browse" ? "approved" : activeTab;
  const communities =
    activeTab === "browse"
      ? communitiesState.approved
      : activeTab === "joined"
        ? communitiesState.joined
        : communitiesState.submissions;
  const total = communitiesState.totals[listKey];
  const joinedUids = new Set(communitiesState.joined.map((item) => item.uid));

  const handleJoin = async (community: Community) => {
    const result = await communitiesState.join(community);
    if (result.success) {
      showToast(result.message || "You joined the community.", {
        variant: "success",
      });
    } else {
      showToast(result.error, { title: "Unable to join", variant: "error" });
    }
  };

  const handleSubmit = async (payload: Parameters<
    typeof communitiesState.submit
  >[0]) => {
    const result = await communitiesState.submit(payload);
    if (result.success) {
      showToast("Community submitted for approval.", { variant: "success" });
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  };

  const refresh = () => {
    void communitiesState.refresh(
      activeTab === "browse" ? debouncedSearch : "",
    );
  };

  const loadMore = async () => {
    const result = await communitiesState.loadMore(listKey, debouncedSearch);
    if (!result.success) {
      showToast(result.error, { title: "Unable to load more", variant: "error" });
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <CommunityScreenHeader
        activeTab={activeTab}
        search={search}
        onSearchChange={setSearch}
        onSelectTab={setActiveTab}
        onSuggest={() => setIsSubmissionVisible(true)}
      />
      <CommunityList
        activeTab={activeTab}
        communities={communities}
        joinedUids={joinedUids}
        total={total}
        isLoading={communitiesState.isLoading}
        isRefreshing={communitiesState.isRefreshing}
        loadingMore={communitiesState.loadingMore === listKey}
        joiningUid={communitiesState.joiningUid}
        error={communitiesState.error}
        onRefresh={refresh}
        onRetry={refresh}
        onLoadMore={() => void loadMore()}
        onJoin={(community) => void handleJoin(community)}
        onExplore={() => setActiveTab("browse")}
        onSuggest={() => setIsSubmissionVisible(true)}
      />
      <CommunitySubmissionModal
        visible={isSubmissionVisible}
        types={communitiesState.types}
        isSubmitting={communitiesState.isSubmitting}
        onClose={() => setIsSubmissionVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
}));
