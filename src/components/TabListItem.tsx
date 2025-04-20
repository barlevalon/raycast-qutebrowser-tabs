import {
  List,
  ActionPanel,
  Action,
  Clipboard,
  showToast,
  Toast,
  closeMainWindow,
  Icon,
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

  const copyUrl = (url: string) => {
    Clipboard.copy(url);
    showToast({
      style: Toast.Style.Success,
      title: "URL copied",
    });
  };

  const openInBrowser = (url: string) => {
    exec(`open "${url}"`);
  };

  const handleTabFocus = async () => {
    const success = await onFocus(tab);
    if (success) {
      await closeMainWindow();
    }
  };

  return (
    <List.Item
      key={`${tab.window}-${tab.index}`}
      icon={tab.pinned ? { source: Icon.Tack } : undefined}
      title={tab.title || "Untitled"}
      subtitle={tab.url}
      accessories={
        [
          { text: `Tab ${tab.index + 1}` },
          tab.pinned ? { tag: "Pinned", color: "green" } : null,
          tab.active ? { tag: "Active", color: "blue" } : null,
        ].filter(Boolean) as {
          text?: string;
          icon?: string;
          tag?: string;
          color?: string;
          tooltip?: string;
        }[]
      }
      actions={
        <ActionPanel>
          <ActionPanel.Section title="Tab Actions">
            <Action
              title="Open with Qutebrowser"
              shortcut={{ modifiers: ["cmd"], key: "o" }}
              onAction={handleTabFocus}
            />
            <Action
              title="Open with Default Browser"
              shortcut={{ modifiers: ["cmd", "shift"], key: "o" }}
              onAction={() => openInBrowser(tab.url)}
            />
            <Action
              title="Copy URL"
              shortcut={{ modifiers: ["cmd"], key: "c" }}
              onAction={() => copyUrl(tab.url)}
            />
          </ActionPanel.Section>

          {tab.debug && (
            <ActionPanel.Section title="Debug Info">
              <Action
                title="Save Debug Info to File"
                onAction={() => saveDebugInfo(tab.debug as DebugInfo)}
              />
              {tab.debug?.autosave_path && (
                <Action
                  title="Autosave Info"
                  onAction={() =>
                    showToast({
                      style: Toast.Style.Animated,
                      title: "Autosave Session Data",
                      message: `File: ${tab.debug?.autosave_path} (${tab.debug?.autosave_age} old)`,
                    })
                  }
                />
              )}
              {tab.debug?.success_file && (
                <Action
                  title="Session Source"
                  onAction={() =>
                    showToast({
                      style: Toast.Style.Animated,
                      title: "Data Source",
                      message: `Using file: ${tab.debug?.success_file}`,
                    })
                  }
                />
              )}
              {tab.debug?.note && (
                <Action
                  title="Note"
                  onAction={() =>
                    showToast({
                      style: Toast.Style.Animated,
                      title: "Info",
                      message: tab.debug?.note || "",
                    })
                  }
                />
              )}
            </ActionPanel.Section>
          )}

          <ActionPanel.Section title="Refresh">
            <Action
              title="Refresh Tabs"
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              onAction={refreshTabs}
              icon={Icon.ArrowClockwise}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
