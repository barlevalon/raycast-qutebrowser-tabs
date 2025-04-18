import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import YAML from "yaml";
import { Tab, DebugInfo, SessionData } from "../types";

const execPromise = util.promisify(exec);

// Constants
export const SESSION_FILE_PATHS = [
  path.join(
    os.homedir(),
    "Library",
    "Application Support",
    "qutebrowser",
    "sessions",
    "_autosave.yml",
  ),
  path.join(os.homedir(), ".qutebrowser", "sessions", "_autosave.yml"),
  path.join(
    os.homedir(),
    ".local",
    "share",
    "qutebrowser",
    "sessions",
    "_autosave.yml",
  ),
];
export const QUTEBROWSER_PROCESS_CHECK =
  "ps aux | grep -v grep | grep qutebrowser";

// Utility functions for session file operations
const SessionUtils = {
  // Check if qutebrowser is running
  isRunning: async (): Promise<boolean> => {
    try {
      const psResult = await execPromise(QUTEBROWSER_PROCESS_CHECK);
      return psResult.stdout.trim().length > 0;
    } catch (e) {
      return false;
    }
  },

  // Format error messages consistently
  formatError: (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  },

  // Find and read the session file
  findSessionFile: (debugInfo: DebugInfo): string | null => {
    for (const filePath of SESSION_FILE_PATHS) {
      try {
        if (fs.existsSync(filePath)) {
          debugInfo.files_found.push(filePath);
          return fs.readFileSync(filePath, "utf-8");
        }
      } catch (e) {
        debugInfo.errors.push(
          `Error checking file ${filePath}: ${SessionUtils.formatError(e)}`,
        );
      }
    }
    return null;
  },

  // Parse a session YAML file
  parseSessionYaml: (content: string): Tab[] => {
    try {
      const sessionData = YAML.parse(content) as SessionData;
      const tabs: Tab[] = [];

      if (sessionData?.windows) {
        sessionData.windows.forEach((window, windowIdx: number) => {
          if (window.tabs) {
            window.tabs.forEach((tab, tabIdx: number) => {
              if (tab.history?.length > 0) {
                const current = tab.history[tab.history.length - 1];

                tabs.push({
                  window: windowIdx,
                  index: tabIdx,
                  url: current.url || "",
                  title: current.title || "Untitled",
                  active: tab.active || current.active || false,
                });
              }
            });
          }
        });
      }

      return tabs;
    } catch (e) {
      console.error("Error parsing YAML:", SessionUtils.formatError(e));
      return [];
    }
  },

  executeCommand: async (
    qutebrowserPath: string,
    command: string,
  ): Promise<void> => {
    await execPromise(`"${qutebrowserPath}" "${command}"`);
  },
};

export default SessionUtils;
