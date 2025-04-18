import { List, ActionPanel, Action, Icon, closeMainWindow } from "@raycast/api";

import { useQutebrowserTabs } from "./hooks/useQutebrowserTabs";
import { TabListItem } from "./components/TabListItem";

export default function Command() {
  const {
    filteredTabs,
    isLoading,
    error,
    searchText,
    setSearchText,
    focusTab,
    openSearchInNewTab,
    openUrlInNewTab,
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
      ) : filteredTabs.length === 0 && searchText ? (
        <>
          <List.Section title="No Matching Tabs">
            <List.Item
              title={`Search for "${searchText}"`}
              subtitle="Search with default search engine"
              icon={Icon.MagnifyingGlass}
              actions={
                <ActionPanel>
                  <Action
                    title="Search Web"
                    shortcut={{ modifiers: ["cmd"], key: "s" }}
                    onAction={async () => {
                      const success = await openSearchInNewTab(searchText);
                      if (success) await closeMainWindow();
                    }}
                  />
                </ActionPanel>
              }
            />
            <List.Item
              title={`Open "${searchText}"`}
              subtitle="Open directly as URL"
              icon={Icon.Globe}
              actions={
                <ActionPanel>
                  <Action
                    title="Open as URL"
                    shortcut={{ modifiers: ["cmd"], key: "o" }}
                    onAction={async () => {
                      const url = searchText.includes('://') ? searchText : `https://${searchText}`;
                      const success = await openUrlInNewTab(url);
                      if (success) await closeMainWindow();
                    }}
                  />
                </ActionPanel>
              }
            />
          </List.Section>
        </>
      ) : filteredTabs.length === 0 ? (
        <List.EmptyView 
          title="No Open Tabs" 
          description="No tabs are currently open in qutebrowser." 
          icon={Icon.XmarkCircle}
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
