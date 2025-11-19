# Example Usage: GitHub Integration Checker

This document shows practical examples of using the GitHub integration checker.

## Scenario 1: First Time Setup

You've just installed VS Code and want to make sure everything is configured correctly for GitHub:

```bash
$ node check-github-integration.js

╔════════════════════════════════════════════════════╗
║  GitHub Integration Checker for VS Code           ║
╚════════════════════════════════════════════════════╝

1. Checking Git Installation
✓ Git is installed: git version 2.42.0

2. Checking Git Configuration
✗ Git user.name is not configured
  Configure it with: git config --global user.name "Your Name"
✗ Git user.email is not configured
  Configure it with: git config --global user.email "your.email@example.com"

3. Checking GitHub Remote Connection
✓ GitHub remote is configured: https://github.com/username/repo

4. Checking GitHub Authentication
✗ GitHub authentication may not be configured
  Configure GitHub authentication:
    - Use GitHub CLI: gh auth login
    - Or use Git Credential Manager
    - Or configure SSH keys

Summary: 2 out of 4 checks passed
```

**Action**: Follow the suggestions to configure git and authenticate with GitHub.

## Scenario 2: Codespaces Environment

You're working in GitHub Codespaces and want to verify everything is set up:

```bash
$ node check-github-integration.js

╔════════════════════════════════════════════════════╗
║  GitHub Integration Checker for VS Code           ║
╚════════════════════════════════════════════════════╝

1. Checking Git Installation
✓ Git is installed: git version 2.51.2

2. Checking Git Configuration
✓ Git user.name is set: Your Name
✓ Git user.email is set: your.email@example.com

3. Checking GitHub Remote Connection
✓ GitHub remote is configured: https://github.com/username/repo

4. Checking GitHub Authentication
✓ GitHub authentication is working

5. Checking VS Code Extensions
✓ VS Code is installed
✓ GitHub Copilot extension is installed
✓ GitHub Pull Requests extension is installed

6. Checking Dev Container Configuration
✓ Dev Container configuration found
✓ GitHub Copilot is configured in devcontainer.json

Summary: All checks passed! (6/6)
Your VS Code is properly configured to use GitHub!
```

**Result**: Everything is configured correctly!

## Scenario 3: Troubleshooting Copilot Issues

GitHub Copilot isn't showing suggestions, so you run the checker:

```bash
$ node check-github-integration.js

╔════════════════════════════════════════════════════╗
║  GitHub Integration Checker for VS Code           ║
╚════════════════════════════════════════════════════╝

1. Checking Git Installation
✓ Git is installed: git version 2.40.0

2. Checking Git Configuration
✓ Git user.name is set: Your Name
✓ Git user.email is set: your.email@example.com

3. Checking GitHub Remote Connection
✓ GitHub remote is configured: https://github.com/username/repo

4. Checking GitHub Authentication
✓ GitHub authentication is working

5. Checking VS Code Extensions
✓ VS Code is installed
⚠ GitHub Copilot extension is not installed
  Install from: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot

Summary: 5 out of 6 checks passed
```

**Action**: Install the GitHub Copilot extension from the marketplace.

## Scenario 4: New Team Member Onboarding

A new developer joins your team. Here's a quick onboarding checklist:

1. Clone the repository:
   ```bash
   git clone https://github.com/username/repo.git
   cd repo
   ```

2. Run the checker:
   ```bash
   node check-github-integration.js
   ```

3. Fix any issues reported by the checker

4. Once all checks pass, start coding with Copilot!

## Scenario 5: CI/CD Pipeline Check

You can use this script in your CI/CD pipeline to verify the environment:

```yaml
# Example GitHub Actions workflow
name: Verify GitHub Integration

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check GitHub Integration
        run: node check-github-integration.js
```

## Tips for Different Situations

### Working Offline
Some checks (like GitHub authentication) will fail when offline. This is expected.

### Using SSH vs HTTPS
Both SSH and HTTPS GitHub URLs are supported. The checker will recognize both.

### Multiple Git Remotes
The checker looks for the `origin` remote. If you use a different remote name, add it manually:
```bash
git remote add origin https://github.com/username/repo.git
```

### Private Repositories
Ensure you have proper authentication set up (SSH keys or Personal Access Token).

## Next Steps After Successful Check

Once all checks pass:

1. **Test GitHub Copilot**: Open a code file and start typing
2. **Try Git Operations**: Make a commit and push to test authentication
3. **Explore Extensions**: Check out other useful GitHub extensions
4. **Read the Guide**: See [GITHUB_INTEGRATION_GUIDE.md](GITHUB_INTEGRATION_GUIDE.md) for more details

## Getting Help

If the checker reports issues you can't resolve:

1. Check the detailed guide: [GITHUB_INTEGRATION_GUIDE.md](GITHUB_INTEGRATION_GUIDE.md)
2. Review VS Code output: View → Output → Select "GitHub" or "GitHub Copilot"
3. Ask for help: https://github.com/orgs/skills/discussions
