# Qutebrowser Tabs

A Raycast extension to search and manage qutebrowser tabs.

## Features

- View all open tabs across all qutebrowser windows
- Search tabs by title or URL
- Focus any tab with a single click
- Open websites in a new tab when no matching tabs are found
- Copy URLs to clipboard
- Fallback search when no tabs match your query
- Debug info for troubleshooting

## Setup

Simply install the extension. If needed, configure the qutebrowser path in preferences:
   - **Qutebrowser Path**: Path to your qutebrowser executable (default: `/opt/homebrew/bin/qutebrowser`)

## How It Works

This extension interacts with qutebrowser by:
1. Reading qutebrowser's auto-saved session file to get tab information
2. Displaying tabs with their titles and URLs in Raycast
3. Using qutebrowser's command-line interface to focus tabs or open new tabs

## Requirements

- Qutebrowser must be installed and running
- Qutebrowser's auto-save session feature must be enabled (default setting)

## Troubleshooting

If you experience issues:
1. Check if qutebrowser is running
2. Verify the qutebrowser path in extension preferences is correct
3. Make sure you have auto-save sessions enabled in qutebrowser (`c.auto_save.session = True`)

## Credits

Developed by Alon Hearter.