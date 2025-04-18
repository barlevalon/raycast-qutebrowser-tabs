import { List, ActionPanel, Action, closeMainWindow } from "@raycast/api";

interface SearchEmptyViewProps {
  title: string;
  description: string;
  searchText: string;
  onSearch: (query: string) => Promise<boolean>;
}

export function SearchEmptyView({
  title,
  description,
  searchText,
  onSearch,
}: SearchEmptyViewProps) {
  const handleSearch = async () => {
    const success = await onSearch(searchText || "");
    if (success) {
      await closeMainWindow();
    }
  };

  return (
    <List.EmptyView
      title={title}
      description={description}
      actions={
        <ActionPanel>
          <Action title="Search Web" onAction={handleSearch} />
        </ActionPanel>
      }
    />
  );
}
