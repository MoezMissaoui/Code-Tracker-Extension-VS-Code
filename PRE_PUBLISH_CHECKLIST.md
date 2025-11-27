# Pre-Publish Checklist

Use this checklist before publishing your extension to ensure everything is ready.

## ✅ Required Items

- [ ] **Publisher name set** in `package.json`
  - Replace `YOUR_PUBLISHER_NAME` with your actual publisher ID
  - Example: `"publisher": "mycompany"`

- [ ] **Repository URL set** in `package.json` (if you have one)
  - Replace `YOUR_REPOSITORY_URL` with your actual repo
  - Example: `"url": "https://github.com/username/code-tracker"`

- [ ] **Description is clear and helpful** in `package.json`
  - Already updated ✓

- [ ] **README.md is complete**
  - Installation instructions ✓
  - Usage examples ✓
  - Troubleshooting section ✓

- [ ] **CHANGELOG.md is updated**
  - Initial release documented ✓

- [ ] **Extension builds successfully**
  ```bash
  npm run compile
  ```

- [ ] **Extension packages successfully**
  ```bash
  vsce package
  ```

- [ ] **Extension tested locally**
  - Install `.vsix` file
  - Test all commands
  - Test settings panel
  - Test automatic tracking
  - Verify API communication

## 🎨 Optional but Recommended

- [ ] **Icon created** (`icon.png` - 128x128 PNG)
  - Place in root directory
  - Update `package.json` if using different name

- [ ] **Screenshots/GIFs added** to README
  - Show settings panel
  - Show tracked files list

- [ ] **License file** (`LICENSE`)
  - MIT license recommended for open source

- [ ] **Badges added** to README (if open source)
  - Version badge
  - Downloads badge
  - License badge

## 🔒 Security Check

- [ ] **No hardcoded secrets** in code
- [ ] **API endpoint is configurable** (or clearly documented)
- [ ] **Client keys stored securely** (using VS Code secrets) ✓

## 📝 Documentation

- [ ] **README.md** explains all features
- [ ] **CHANGELOG.md** has initial release notes
- [ ] **Code comments** are clear (for future maintenance)

## 🧪 Testing

- [ ] **All commands work**
  - `code-tracker.openSettings`
  - `code-tracker.configureClientKey`
  - `code-tracker.sendNotebookState`

- [ ] **Settings panel works**
  - Key management
  - File list loading
  - Copy content feature

- [ ] **Automatic tracking works**
  - Executes on cell run
  - Sends to API correctly

- [ ] **Error handling works**
  - Invalid API key
  - Network errors
  - Missing notebook

## 📦 Final Steps

1. **Build**: `npm run compile`
2. **Package**: `vsce package`
3. **Test locally**: Install `.vsix` and verify everything
4. **Publish**: `vsce publish` (or upload manually)

---

**Ready to publish?** Follow the steps in `PUBLISHING.md`! 🚀

