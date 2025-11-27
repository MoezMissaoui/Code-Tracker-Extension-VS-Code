# Code Tracker

**Code Tracker** is a VS Code extension that automatically tracks and saves Jupyter notebook states to your API whenever cells are executed. Perfect for data scientists and ML engineers who need to maintain a history of their notebook executions.

## Features

- 🔄 **Automatic Tracking**: Automatically sends notebook state to your API when cells are executed
- 🔐 **Secure Key Management**: Store and manage your API client key securely using VS Code's secret storage
- 📊 **Settings Panel**: Beautiful UI to manage your client key and view all tracked files
- 📋 **Copy Content**: Easily copy notebook content to clipboard with one click
- 🎯 **Manual Save**: Option to manually trigger saving notebook state via command palette

## Requirements

- VS Code 1.80.0 or higher
- Jupyter extension installed (for `.ipynb` file support)
- Access to your Code Tracker API endpoint

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Code Tracker"
4. Click **Install**

### Manual Installation

1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Go to Extensions view
4. Click the `...` menu → **Install from VSIX...**
5. Select the downloaded `.vsix` file

## Quick Start

1. **Get your API client key** from your Code Tracker service
2. **Open Settings**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) → Type "Code Tracker: Open Settings"
3. **Enter your client key** in the "Client key" tab and click "Save key"
4. **Start working**: Open any `.ipynb` notebook and execute cells - they'll be automatically tracked!

## Usage

### Automatic Tracking

Once you've set up your client key, the extension automatically:
- Detects when you execute cells in a Jupyter notebook
- Reads the current notebook state
- Sends it to your API endpoint with your client key

No manual intervention needed!

### Manual Save

You can also manually trigger saving:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Code Tracker: Send Notebook State"
3. Press Enter

### View Tracked Files

1. Open Settings: `Ctrl+Shift+P` → "Code Tracker: Open Settings"
2. Click the **"Saved files"** tab
3. Click **"Refresh list"** to see all tracked files
4. Click the 📋 icon next to any file to copy its content to clipboard

### Manage Client Key

**Open Settings Panel:**
- `Ctrl+Shift+P` → "Code Tracker: Open Settings"

**Quick Configure:**
- `Ctrl+Shift+P` → "Code Tracker: Configure Client Key"

In the settings panel you can:
- View your stored key (with show/hide toggle)
- Update your key
- Delete your key

## Extension Settings

This extension contributes the following commands:

- `code-tracker.openSettings`: Open the Code Tracker settings panel
- `code-tracker.configureClientKey`: Quickly configure your client key
- `code-tracker.sendNotebookState`: Manually send current notebook state to API

## API Configuration

By default, the extension connects to:
```
https://code-tracker.api.51.75.73.102.nip.io/api/v1/files
```

To use a different endpoint, you'll need to modify the extension code.

## API Format

The extension sends POST requests with the following payload:

```json
{
  "fileName": "notebook.ipynb",
  "filePath": "/absolute/path/to/notebook.ipynb",
  "fullContent": "{...full notebook JSON...}",
  "timestamp": "2025-11-27T09:09:49.340Z"
}
```

Headers:
- `Content-Type: application/json`
- `Accept: application/json`
- `x-api-key: YOUR_CLIENT_KEY`

## Privacy & Security

- Your client key is stored securely using VS Code's secret storage (encrypted)
- The key is never logged or exposed in the extension code
- All API communication uses HTTPS (when configured)

## Troubleshooting

### Extension not tracking cells

1. Make sure you've set up your client key in Settings
2. Verify the notebook file is a valid `.ipynb` file
3. Check the Debug Console for error messages

### API errors

- Verify your client key is correct
- Check that your API endpoint is accessible
- Review error messages in VS Code notifications

### Key not saving

- Make sure VS Code has permission to access secret storage
- Try restarting VS Code
- Check the Debug Console for errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Release Notes

### 0.0.1

Initial release of Code Tracker:
- Automatic notebook state tracking on cell execution
- Secure client key management
- Settings panel with key management and file viewing
- Manual save command
- Copy content to clipboard feature

---

**Enjoy tracking your notebooks!** 🚀
