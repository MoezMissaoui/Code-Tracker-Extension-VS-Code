# Publishing Guide for Code Tracker Extension

This guide will help you package and publish your extension to the VS Code Marketplace.

## Prerequisites

1. **Install VS Code Extension Manager (vsce)**
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Create a Publisher Account**
   - Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
   - Sign in with your Microsoft/Azure account
   - Create a new publisher (if you don't have one)
   - Note your publisher ID

3. **Get a Personal Access Token**
   - Go to [Azure DevOps](https://dev.azure.com)
   - User Settings → Personal Access Tokens
   - Create a new token with "Marketplace (Manage)" scope
   - Save the token securely

## Step 1: Update package.json

Before publishing, make sure to:

1. **Set your publisher name** in `package.json`:
   ```json
   "publisher": "your-publisher-name"
   ```

2. **Add repository URL** (if you have one):
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/yourusername/code-tracker"
   }
   ```

3. **Add an icon** (optional but recommended):
   - Create a `128x128` PNG image named `icon.png` in the root directory
   - The icon will appear in the VS Code Marketplace

## Step 2: Build the Extension

```bash
npm run compile
```

This creates the production build in the `dist/` folder.

## Step 3: Package the Extension

```bash
vsce package
```

This creates a `.vsix` file that you can:
- Install locally for testing
- Share with others
- Upload to the marketplace

### Test the Package Locally

1. In VS Code, go to Extensions view
2. Click `...` menu → **Install from VSIX...**
3. Select your `.vsix` file
4. Test all features to ensure everything works

## Step 4: Publish to Marketplace

### First Time Publishing

```bash
vsce publish
```

You'll be prompted for:
- Your Personal Access Token (from Prerequisites)
- Your publisher name

### Update Existing Extension

```bash
vsce publish
```

This will automatically increment the version number in `package.json` based on your changes.

### Publish with Specific Version

```bash
vsce publish 1.0.0
```

## Step 5: Verify Publication

1. Go to [VS Code Marketplace](https://marketplace.visualstudio.com/vscode)
2. Search for your extension
3. Verify all information is correct

## Alternative: Manual Upload

If you prefer not to use the command line:

1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
2. Click "New extension" → "Visual Studio Code"
3. Upload your `.vsix` file
4. Fill in the required information

## Updating Your Extension

1. Make your changes
2. Update `CHANGELOG.md` with new features/fixes
3. Update version in `package.json` (following [Semantic Versioning](https://semver.org/))
4. Build: `npm run compile`
5. Package: `vsce package`
6. Test the `.vsix` file
7. Publish: `vsce publish`

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

## Troubleshooting

### "Extension name not found"
- Make sure `publisher` is set in `package.json`
- Verify you're logged in: `vsce login <publisher-name>`

### "Invalid Personal Access Token"
- Generate a new token with "Marketplace (Manage)" scope
- Make sure the token hasn't expired

### "Extension validation failed"
- Check that all required fields in `package.json` are filled
- Verify `README.md` exists and is valid Markdown
- Ensure `CHANGELOG.md` follows the format

## Distribution Options

### 1. VS Code Marketplace (Recommended)
- Free
- Automatic updates
- Discoverable by millions of users
- Requires publisher account

### 2. Open VSX Registry
- Open-source alternative
- Free and open
- Good for open-source projects

### 3. GitHub Releases
- Share `.vsix` file in releases
- Users install manually
- Good for private/internal use

### 4. Private Distribution
- Host `.vsix` file on your server
- Share download link
- Users install manually

## Best Practices

1. **Test thoroughly** before publishing
2. **Update CHANGELOG.md** with every release
3. **Use semantic versioning**
4. **Write clear README** with examples
5. **Respond to issues** and user feedback
6. **Keep dependencies updated**
7. **Follow VS Code extension guidelines**

## Resources

- [VS Code Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)

---

Good luck with your extension! 🚀

