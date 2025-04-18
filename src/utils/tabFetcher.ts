import { DebugInfo, Tab } from "../types";
import SessionUtils from "./sessionUtils";

/**
 * Fetches qutebrowser tabs from session files
 * @returns Array of Tab objects
 */
export async function fetchQutebrowserTabs(): Promise<Tab[]> {
  const debugInfo: DebugInfo = {
    locations_checked: [],
    files_found: [],
    errors: [],
  };

  // Check if qutebrowser is running
  const qutebrowserRunning = await SessionUtils.isRunning();
  debugInfo.qutebrowser_running = qutebrowserRunning;

  if (!qutebrowserRunning) {
    throw new Error(
      "Qutebrowser is not running. Please start qutebrowser first.",
    );
  }

  // Find and read the session file
  const content = SessionUtils.findSessionFile(debugInfo);
  let tabs: Tab[] = [];

  if (content) {
    // Parse the session file content
    tabs = SessionUtils.parseSessionYaml(content);

    if (tabs.length > 0) {
      debugInfo.tabs_found = tabs.length;
    } else {
      debugInfo.errors.push("No tabs found in session files");
    }
  }

  // If no tabs found, create a debug tab
  if (tabs.length === 0) {
    // Double check qutebrowser is running
    debugInfo.qutebrowser_running = await SessionUtils.isRunning();

    tabs = [
      {
        window: 0,
        index: 0,
        url: "https://qutebrowser.org",
        title: "No tabs found - Click for debug info",
        active: true,
        debug: debugInfo,
      },
    ];
  }

  return tabs;
}
