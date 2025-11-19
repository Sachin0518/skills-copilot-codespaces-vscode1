#!/usr/bin/env node

/**
 * GitHub Integration Checker for VS Code
 * This script helps verify if VS Code is properly configured to use GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

function printHeader(text) {
    console.log(`\n${colors.bold}${colors.blue}${text}${colors.reset}`);
    console.log('='.repeat(text.length));
}

function printSuccess(text) {
    console.log(`${colors.green}✓${colors.reset} ${text}`);
}

function printError(text) {
    console.log(`${colors.red}✗${colors.reset} ${text}`);
}

function printWarning(text) {
    console.log(`${colors.yellow}⚠${colors.reset} ${text}`);
}

function printInfo(text) {
    console.log(`  ${text}`);
}

function executeCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch (error) {
        return null;
    }
}

function checkGitInstallation() {
    printHeader('1. Checking Git Installation');
    const gitVersion = executeCommand('git --version');
    
    if (gitVersion) {
        printSuccess(`Git is installed: ${gitVersion}`);
        return true;
    } else {
        printError('Git is not installed or not in PATH');
        printInfo('Install Git from: https://git-scm.com/downloads');
        return false;
    }
}

function checkGitConfiguration() {
    printHeader('2. Checking Git Configuration');
    let allGood = true;
    
    const userName = executeCommand('git config user.name');
    if (userName) {
        printSuccess(`Git user.name is set: ${userName}`);
    } else {
        printError('Git user.name is not configured');
        printInfo('Configure it with: git config --global user.name "Your Name"');
        allGood = false;
    }
    
    const userEmail = executeCommand('git config user.email');
    if (userEmail) {
        printSuccess(`Git user.email is set: ${userEmail}`);
    } else {
        printError('Git user.email is not configured');
        printInfo('Configure it with: git config --global user.email "your.email@example.com"');
        allGood = false;
    }
    
    return allGood;
}

function checkGitHubRemote() {
    printHeader('3. Checking GitHub Remote Connection');
    
    // Check if we're in a git repository
    const isGitRepo = executeCommand('git rev-parse --is-inside-work-tree');
    if (!isGitRepo) {
        printWarning('Not inside a git repository');
        return false;
    }
    
    const remoteUrl = executeCommand('git remote get-url origin');
    if (remoteUrl) {
        if (remoteUrl.includes('github.com')) {
            printSuccess(`GitHub remote is configured: ${remoteUrl}`);
            return true;
        } else {
            printWarning(`Remote is configured but not GitHub: ${remoteUrl}`);
            return false;
        }
    } else {
        printError('No remote repository configured');
        printInfo('Add a GitHub remote with: git remote add origin <github-repo-url>');
        return false;
    }
}

function checkGitHubAuthentication() {
    printHeader('4. Checking GitHub Authentication');
    
    // Try to fetch from remote (dry-run)
    const fetchTest = executeCommand('git ls-remote origin HEAD 2>&1');
    if (fetchTest && !fetchTest.toLowerCase().includes('error') && !fetchTest.toLowerCase().includes('fatal')) {
        printSuccess('GitHub authentication is working');
        return true;
    } else {
        printError('GitHub authentication may not be configured');
        printInfo('Configure GitHub authentication:');
        printInfo('  - Use GitHub CLI: gh auth login');
        printInfo('  - Or use Git Credential Manager');
        printInfo('  - Or configure SSH keys: https://docs.github.com/en/authentication');
        return false;
    }
}

function checkVSCodeExtensions() {
    printHeader('5. Checking VS Code Extensions');
    
    // Check if code command is available
    const codeVersion = executeCommand('code --version');
    if (!codeVersion) {
        printWarning('VS Code CLI is not available');
        printInfo('Make sure VS Code is installed and "code" command is in PATH');
        printInfo('In VS Code: Cmd/Ctrl+Shift+P -> "Shell Command: Install \'code\' command in PATH"');
        return false;
    }
    
    printSuccess(`VS Code is installed: ${codeVersion.split('\n')[0]}`);
    
    // Check for GitHub-related extensions
    const extensions = executeCommand('code --list-extensions');
    if (!extensions) {
        printWarning('Could not retrieve VS Code extensions list');
        return false;
    }
    
    const extensionList = extensions.split('\n');
    
    // Check for GitHub Copilot
    if (extensionList.includes('GitHub.copilot')) {
        printSuccess('GitHub Copilot extension is installed');
    } else {
        printWarning('GitHub Copilot extension is not installed');
        printInfo('Install from: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot');
    }
    
    // Check for GitHub Pull Requests
    if (extensionList.includes('GitHub.vscode-pull-request-github')) {
        printSuccess('GitHub Pull Requests extension is installed');
    } else {
        printWarning('GitHub Pull Requests extension is not installed (optional)');
    }
    
    // Check for GitLens (optional but useful)
    if (extensionList.includes('eamodio.gitlens')) {
        printSuccess('GitLens extension is installed');
    } else {
        printInfo('GitLens extension is not installed (optional but recommended)');
    }
    
    return true;
}

function checkDevContainerConfiguration() {
    printHeader('6. Checking Dev Container Configuration');
    
    const devcontainerPath = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');
    
    if (fs.existsSync(devcontainerPath)) {
        try {
            // Remove comments from JSON before parsing (JSON with comments support)
            const fileContent = fs.readFileSync(devcontainerPath, 'utf8');
            const jsonContent = fileContent.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
            const devcontainerConfig = JSON.parse(jsonContent);
            printSuccess('Dev Container configuration found');
            
            if (devcontainerConfig.customizations?.vscode?.extensions) {
                const extensions = devcontainerConfig.customizations.vscode.extensions;
                if (extensions.includes('GitHub.copilot')) {
                    printSuccess('GitHub Copilot is configured in devcontainer.json');
                }
                printInfo(`Configured extensions: ${extensions.join(', ')}`);
            }
            return true;
        } catch (error) {
            printWarning(`Dev Container configuration exists but could not be parsed: ${error.message}`);
            return false;
        }
    } else {
        printInfo('No Dev Container configuration found (optional)');
        return false;
    }
}

function printSummary(results) {
    printHeader('Summary');
    
    const successCount = results.filter(r => r === true).length;
    const totalChecks = results.filter(r => r !== null).length;
    
    console.log('');
    if (successCount === totalChecks) {
        printSuccess(`All checks passed! (${successCount}/${totalChecks})`);
        console.log('\n' + colors.green + 'Your VS Code is properly configured to use GitHub!' + colors.reset);
    } else {
        printWarning(`${successCount} out of ${totalChecks} checks passed`);
        console.log('\n' + colors.yellow + 'Some configuration issues were found. Please review the output above.' + colors.reset);
    }
    
    console.log('\n' + colors.blue + 'Additional Resources:' + colors.reset);
    printInfo('- GitHub Docs: https://docs.github.com/en/get-started');
    printInfo('- VS Code with GitHub: https://code.visualstudio.com/docs/sourcecontrol/github');
    printInfo('- GitHub Copilot Setup: https://docs.github.com/en/copilot/getting-started-with-github-copilot');
}

function main() {
    console.log(colors.bold + colors.blue);
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║  GitHub Integration Checker for VS Code           ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    const results = [
        checkGitInstallation(),
        checkGitConfiguration(),
        checkGitHubRemote(),
        checkGitHubAuthentication(),
        checkVSCodeExtensions(),
        checkDevContainerConfiguration()
    ];
    
    printSummary(results);
}

// Run the checker
main();
