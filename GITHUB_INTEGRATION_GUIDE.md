# How to Check if VS Code is Using GitHub

This guide helps you verify that VS Code is properly configured to work with GitHub and GitHub Copilot.

## Quick Check

Run the automated checker script:

```bash
node check-github-integration.js
```

This script will verify:
1. ✅ Git installation
2. ✅ Git configuration (user.name, user.email)
3. ✅ GitHub remote connection
4. ✅ GitHub authentication
5. ✅ VS Code extensions (GitHub Copilot, etc.)
6. ✅ Dev Container configuration

## Manual Verification Steps

If you prefer to check manually, follow these steps:

### 1. Check Git Installation

```bash
git --version
```

Expected output: `git version 2.x.x` or higher

### 2. Check Git Configuration

```bash
git config user.name
git config user.email
```

Both commands should return your configured name and email.

**If not configured:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Check GitHub Remote

```bash
git remote -v
```

You should see a GitHub URL (either HTTPS or SSH):
- HTTPS: `https://github.com/username/repository.git`
- SSH: `git@github.com:username/repository.git`

### 4. Check GitHub Authentication

Try fetching from your repository:

```bash
git fetch
```

If this works without asking for credentials, your authentication is set up correctly.

**Authentication Options:**
- **GitHub CLI**: `gh auth login`
- **SSH Keys**: [Setup Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- **Personal Access Token**: [Setup Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### 5. Check VS Code Extensions

In VS Code:
1. Open Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: "Extensions: Show Installed Extensions"
3. Look for:
   - **GitHub Copilot** (GitHub.copilot)
   - **GitHub Pull Requests** (GitHub.vscode-pull-request-github) - optional but recommended

**Or via command line:**
```bash
code --list-extensions | grep -i github
```

### 6. Check GitHub Copilot Status

In VS Code:
1. Look at the bottom-right corner of the status bar
2. You should see the GitHub Copilot icon (looks like a ghost 👻)
3. Click on it to see the status:
   - ✅ Green checkmark: Copilot is active
   - ❌ Red X: Copilot is disabled or not authenticated

### 7. Test GitHub Copilot

1. Open a JavaScript file (or create a new one)
2. Start typing a comment or function:
   ```javascript
   // Function to calculate the sum of two numbers
   function add
   ```
3. Copilot should suggest code completions in gray text
4. Press `Tab` to accept the suggestion

## Common Issues and Solutions

### Issue: "Git is not recognized"
**Solution:** Install Git from https://git-scm.com/downloads and ensure it's in your PATH.

### Issue: "GitHub Copilot not showing suggestions"
**Solutions:**
1. Check if Copilot is enabled (status bar icon)
2. Sign in to GitHub: Command Palette → "GitHub Copilot: Sign In"
3. Verify your Copilot subscription: https://github.com/settings/copilot
4. Restart VS Code

### Issue: "Permission denied (publickey)"
**Solution:** Set up SSH keys or use HTTPS authentication with a Personal Access Token.

### Issue: "code command not found"
**Solution:** 
1. Open VS Code
2. Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type: "Shell Command: Install 'code' command in PATH"
4. Restart your terminal

## GitHub Copilot in Codespaces

If you're using GitHub Codespaces:

1. Copilot should be automatically configured if included in `.devcontainer/devcontainer.json`
2. You're automatically authenticated with your GitHub account
3. No additional setup required!

Check the configuration:
```bash
cat .devcontainer/devcontainer.json
```

Look for:
```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "GitHub.copilot"
      ]
    }
  }
}
```

## Verifying VS Code is Connected to GitHub

### In VS Code UI:

1. **Source Control Panel** (Left sidebar, branch icon):
   - Should show your repository name
   - Should show current branch
   - Should allow you to pull/push changes

2. **Accounts Menu** (Bottom-left corner, account icon):
   - Should show "Signed in to GitHub"
   - Shows your GitHub username

3. **GitHub Copilot Icon** (Bottom-right status bar):
   - Should show status of Copilot
   - Click to see detailed status

### Via Command Line:

```bash
# Check if you can fetch from GitHub
git fetch --dry-run

# Check authentication
gh auth status

# List remote repositories
git remote -v
```

## Additional Resources

- [VS Code with GitHub Documentation](https://code.visualstudio.com/docs/sourcecontrol/github)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

## Troubleshooting

If you continue to have issues after following this guide:

1. Check GitHub status: https://www.githubstatus.com/
2. Review VS Code output: View → Output → Select "GitHub" or "GitHub Copilot"
3. Check VS Code logs: Help → Toggle Developer Tools → Console tab
4. Ask for help: https://github.com/orgs/skills/discussions

---

**Need help?** Run the automated checker for a comprehensive diagnosis:
```bash
node check-github-integration.js
```
