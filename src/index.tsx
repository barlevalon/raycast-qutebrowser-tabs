import { List, ActionPanel, Action } from "@raycast/api";

import { useQutebrowserTabs } from "./hooks/useQutebrowserTabs";
import { TabListItem } from "./components/TabListItem";
import { SearchEmptyView } from "./components/SearchEmptyView";

export default function Command() {
  const {
    filteredTabs,
    isLoading,
    error,
    searchText,
    setSearchText,
    focusTab,
    openSearchInNewTab,
    refreshTabs,
  } = useQutebrowserTabs();

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search tabs by title or URL..."
      filtering={false}
      onSearchTextChange={setSearchText}
      actions={
        <ActionPanel>
          <Action
            title="Refresh Tabs"
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={refreshTabs}
          />
        </ActionPanel>
      }
    >
      {error ? (
        <List.EmptyView title="Error" description={error} />
      ) : filteredTabs.length === 0 ? (
        <SearchEmptyView
          title="No Matching Tabs"
          description={
            searchText
              ? "Your search doesn't match any open tabs. Press Enter to search the web."
              : "No tabs are currently open in qutebrowser. Press Enter to search the web."
          }
          searchText={searchText}
          onSearch={openSearchInNewTab}
        />
      ) : (
        filteredTabs.map((tab) => (
          <TabListItem
            key={`${tab.window}-${tab.index}`}
            tab={tab}
            onFocus={focusTab}
            refreshTabs={refreshTabs}
          />
        ))
      )}
    </List>
  );
}
