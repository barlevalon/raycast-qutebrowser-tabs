import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useState, useCallback } from "react";
import { usePromise } from "@raycast/utils";
import { Preferences, Tab } from "../types";
import { fetchQutebrowserTabs } from "../utils/tabFetcher";
import SessionUtils from "../utils/sessionUtils";

/**
 * Custom hook to manage qutebrowser tabs
 */
export function useQutebrowserTabs() {
  const preferences = getPreferenceValues<Preferences>();
  const qutebrowserPath =
    preferences.qutebrowserPath || "/opt/homebrew/bin/qutebrowser";

  // Use Raycast's usePromise for automatic data fetching and loading state
  const {
    data: tabs = [],
    isLoading,
    error,
    revalidate,
  } = usePromise(fetchQutebrowserTabs, [], {
    onError: (error) => {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch tabs",
        message: SessionUtils.formatError(error),
      });
    },
  });

  // Search state
  const [searchText, setSearchText] = useState<string>("");

  // Filter tabs based on search text
  const filteredTabs = tabs.filter((tab) => {
    if (!searchText.trim()) return true;

    const lowerCaseSearch = searchText.toLowerCase();
    return (
      tab.title.toLowerCase().includes(lowerCaseSearch) ||
      tab.url.toLowerCase().includes(lowerCaseSearch)
    );
  });

  // Tab actions
  const focusTab = useCallback(
    async (tab: Tab) => {
      try {
        await SessionUtils.executeCommand(
          qutebrowserPath,
          `:tab-select ${tab.url}`,
        );
        return true;
      } catch (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to focus tab",
          message: SessionUtils.formatError(err),
        });
        return false;
      }
    },
    [qutebrowserPath],
  );

  const openSearchInNewTab = useCallback(
    async (query: string) => {
      try {
        // Use DEFAULT which is the name of the default search engine in qutebrowser's url.searchengines
        await SessionUtils.executeCommand(qutebrowserPath, `:open -t DEFAULT ${query}`);
        return true;
      } catch (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to open search",
          message: SessionUtils.formatError(err),
        });
        return false;
      }
    },
    [qutebrowserPath],
  );

  const openUrlInNewTab = useCallback(
    async (url: string) => {
      try {
        await SessionUtils.executeCommand(qutebrowserPath, `:open -t ${url}`);
        return true;
      } catch (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to open URL",
          message: SessionUtils.formatError(err),
        });
        return false;
      }
    },
    [qutebrowserPath],
  );

  return {
    tabs,
    filteredTabs,
    isLoading,
    error: error ? String(error) : null,
    searchText,
    setSearchText,
    focusTab,
    openSearchInNewTab,
    openUrlInNewTab,
    refreshTabs: revalidate,
  };
}
