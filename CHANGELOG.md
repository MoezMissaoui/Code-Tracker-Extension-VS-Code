# Change Log

All notable changes to the "Code Tracker" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.1] - 2025-11-27

### Added
- Automatic tracking of Jupyter notebook states when cells are executed
- Secure client key storage using VS Code secret storage
- Settings panel with two tabs:
  - **Client key tab**: View, update, and delete your API client key with show/hide toggle
  - **Saved files tab**: View all tracked files and copy content to clipboard
- Manual save command (`Code Tracker: Send Notebook State`)
- Quick configure command (`Code Tracker: Configure Client Key`)
- Clean, modular codebase structure:
  - `keyStore.ts` - Key management functions
  - `trackerApi.ts` - API communication
  - `settingsPanel.ts` - Settings UI webview
  - `notebookWatcher.ts` - Notebook change detection
  - `constants.ts` - Configuration constants
- Support for production API endpoint
- Error handling and user-friendly notifications

### Security
- Client keys stored securely using VS Code's encrypted secret storage
- API key sent in `x-api-key` header for authentication

---

## [Unreleased]

- Future features and improvements will be listed here
