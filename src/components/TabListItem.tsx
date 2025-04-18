import {
  List,
  ActionPanel,
  Action,
  Clipboard,
  showToast,
  Toast,
  closeMainWindow,
} from "@raycast/api";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { Tab, DebugInfo } from "../types";

interface TabListItemProps {
  tab: Tab;
  onFocus: (tab: Tab) => Promise<boolean>;
  refreshTabs: () => void;
}

export function TabListItem({ tab, onFocus, refreshTabs }: TabListItemProps) {
  // Function to save debug info to a file
  const saveDebugInfo = async (debugInfo: DebugInfo) => {
    try {
      const debugPath = path.join(
        os.homedir(),
        "Desktop",
        "qutebrowser-raycast-debug.json",
      );
      fs.writeFileSync(debugPath, JSON.stringify(debugInfo, null, 2));
      showToast({
        style: Toast.Style.Success,
        title: "Debug Info Saved",
        message: `Saved to ${debugPath}`,
      });
      exec(`open "${debugPath}"`);
    } catch (err) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to save debug info",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Function for copying URL to clipboard
  const copyUrl = (url: string) => {
    Clipboard.copy(url);
    showToast({
      style: Toast.Style.Success,
      title: "URL copied",
    });
  };

  // Function to open URL in default browser
  const openInBrowser = (url: string) => {
    exec(`open "${url}"`);
  };

  // Handle tab focus with auto-closing main window
  const handleTabFocus = async () => {
    const success = await onFocus(tab);
    if (success) {
      await closeMainWindow();
    }
  };

  return (
    <List.Item
      key={`${tab.window}-${tab.index}`}
      title={tab.title || "Untitled"}
      subtitle={tab.url}
      accessories={
        [
          { text: `Window ${tab.window + 1}, Tab ${tab.index + 1}` },
          tab.active ? { icon: "checkmark-circle" } : null,
        ].filter(Boolean) as { text?: string; icon?: string }[]
      }
      actions={
        <ActionPanel>
          {tab.debug && (
            <ActionPanel.Section title="Debug Info">
              <Action
                title="Save Debug Info to File"
                onAction={() => saveDebugInfo(tab.debug as DebugInfo)}
              />
            </ActionPanel.Section>
          )}

          <ActionPanel.Section title="Tab Actions">
            <Action
              title="Focus Tab"
              shortcut={{ modifiers: ["cmd"], key: "f" }}
              onAction={handleTabFocus}
            />
            <Action
              title="Open in Default Browser"
              shortcut={{ modifiers: ["cmd"], key: "o" }}
              onAction={() => openInBrowser(tab.url)}
            />
            <Action
              title="Copy URL"
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
              onAction={() => copyUrl(tab.url)}
            />
          </ActionPanel.Section>

          <ActionPanel.Section title="Refresh">
            <Action
              title="Refresh Tabs"
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              onAction={refreshTabs}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
