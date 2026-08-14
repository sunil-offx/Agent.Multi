# Auto Debugging System - Deployment Guide

Complete step-by-step guide to deploy the Auto Debugging System in your repository.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 minutes)](#quick-start-5-minutes)
3. [Full Setup with MCP (20 minutes)](#full-setup-with-mcp-20-minutes)
4. [Verification & Testing](#verification--testing)
5. [Production Deployment](#production-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required
- ✅ GitHub repository with write access
- ✅ Node.js 18+ installed locally
- ✅ Git installed and configured
- ✅ Bash/PowerShell shell access

### Optional (for specific error sources)
- 🔧 Sentry account + auth token (for crash reporting)
- 🔧 Datadog account + API key (for performance monitoring)
- 🔧 Local test infrastructure running

---

## Quick Start (5 minutes)

### Step 1: Copy Agent Files to Your Repo

```bash
# Clone or copy the agent files to your repo
cd your-repo

# Create required directories
mkdir -p .github/agents
mkdir -p .github/workflows
mkdir -p .github/scripts
mkdir -p .github/error-sources
mkdir -p .github/logs

# Copy all agent .md files
cp /path/to/agents/.agent.md .github/agents/
cp /path/to/agents/.github/agents/*.agent.md .github/agents/
cp /path/to/agents/.github/agents/README.md .github/agents/

# Copy workflows and scripts
cp /path/to/agents/.github/workflows/auto-debug-monitor.yml .github/workflows/
cp /path/to/agents/.github/scripts/*.js .github/scripts/

# Copy error source configs
cp /path/to/agents/.github/error-sources/README.md .github/error-sources/
```

### Step 2: Create GitHub Secrets

Add these secrets to your GitHub repo (Settings → Secrets and variables → Actions):

```bash
# Required for GitHub Actions workflow
GITHUB_TOKEN=your_github_token  # Usually auto-set, but ensure it has:
                                # - read:org
                                # - repo (full repo access)
                                # - write:pull-requests
```

### Step 3: Test with a Sample Error

```bash
# Manually trigger the monitoring workflow
gh workflow run auto-debug-monitor.yml -f error_message="Test error from deployment"

# Watch the workflow execute
gh run watch
```

**Expected result:**
- ✅ Workflow runs
- ✅ Error is ingested
- ✅ Auto Debugging System evaluates it
- ✅ Check if PR was raised (depends on confidence)

### Step 4: Verify Installation

```bash
# List agent files
ls -la .github/agents/

# Check workflow file
cat .github/workflows/auto-debug-monitor.yml

# Verify scripts are executable
chmod +x .github/scripts/*.js
```

✅ **Quick Start Complete!** Your basic setup is ready.

---

## Full Setup with MCP (20 minutes)

This enables real-time error ingestion from external services.

### Step 1: Install MCP Servers

```bash
# Install npm MCP servers
npm install --save-dev \
  @modelcontextprotocol/server-github \
  @modelcontextprotocol/server-sentry

# Or globally
npm install -g \
  @modelcontextprotocol/server-github \
  @modelcontextprotocol/server-sentry
```

### Step 2: Create MCP Configuration

**File:** `.mcp-server-config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["node_modules/@modelcontextprotocol/server-github/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Step 3: Set Environment Variables

**File:** `.env.local` (add to .gitignore)

```bash
# GitHub
GITHUB_TOKEN=ghp_your_github_token

# Sentry (optional)
SENTRY_AUTH_TOKEN=sntr_your_sentry_token
SENTRY_ORG=your_organization
SENTRY_PROJECT=your_project

# Datadog (optional)
DD_API_KEY=your_datadog_api_key
DD_APP_KEY=your_datadog_app_key
```

### Step 4: Create Error Source Config

**File:** `.github/error-sources/github-actions.config.json`

```json
{
  "enabled": true,
  "api": {
    "token": "${GITHUB_TOKEN}",
    "owner": "your-org",
    "repo": "your-repo"
  },
  "workflows": [
    {
      "name": "tests.yml",
      "include_on_failure": true,
      "parse_logs": true
    }
  ],
  "ingestion": {
    "poll_interval_seconds": 30
  }
}
```

### Step 5: Create Webhook Handler

**File:** `.github/webhooks/error-webhook.js`

```javascript
const express = require('express');
const app = express();
const { AutoDebuggingSystem } = require('../agents');

app.use(express.json());

app.post('/webhook/error', async (req, res) => {
  try {
    const error = req.body;
    console.log(`[WEBHOOK] Received error: ${error.message}`);
    
    // Ingest to Auto Debugging System
    await AutoDebuggingSystem.ingestError(error);
    
    res.status(200).json({ status: 'received', id: error.error_id });
  } catch (err) {
    console.error(`[WEBHOOK ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Error webhook listening on port ${PORT}`);
});
```

### Step 6: Start Error Monitoring

```bash
# Start local webhook listener
node .github/webhooks/error-webhook.js

# In another terminal, start monitoring
npm run error-sources:start
```

### Step 7: Expose Webhook for External Services

```bash
# Use ngrok to expose local webhook
npm install -g ngrok
ngrok http 3000

# Use the ngrok URL in error source configurations
# E.g., https://abc123.ngrok.io/webhook/error
```

✅ **MCP Setup Complete!** Now configure error sources:

- [Sentry Webhook Config](https://docs.sentry.io/product/integrations/notification-incidents/webhook/) → `https://abc123.ngrok.io/webhook/error`
- [GitHub Actions Workflow](auto-debug-monitor.yml) → Runs automatically on test failures
- [Datadog Webhooks](https://docs.datadoghq.com/integrations/webhooks/) → `https://abc123.ngrok.io/webhook/error`

---

## Verification & Testing

### Test 1: Manual Error Trigger

```bash
# Send test error to webhook
curl -X POST http://localhost:3000/webhook/error \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test error from manual trigger",
    "type": "runtime_error",
    "severity": "major",
    "location": {
      "file": "test.tsx",
      "line": 42
    }
  }'

# Expected response:
# { "status": "received", "id": "..." }
```

### Test 2: Monitor Error Ingestion

```bash
# View ingestion rate
npm run error-sources:stats

# Expected output:
# Errors ingested (last 1h): 5
# Sources: [GitHub Actions, Local Logs]
# Last error: 2026-08-13 10:23:45
```

### Test 3: Verify PR Generation

```bash
# Check for auto-raised PRs
gh pr list --state open --search "AUTO-FIX"

# Expected output:
# [AUTO-FIX] TypeError: Cannot read property 'map' (pr-123)
# [AUTO-FIX] Test Failure: LoginButton (pr-124)
```

### Test 4: Validate Confidence Scoring

```bash
# Check PR body for confidence score
gh pr view pr-123 --json body | grep -i confidence

# Expected output:
# Confidence: 95%
```

---

## Production Deployment

### Step 1: Environment Setup

```bash
# Create production GitHub environment
gh api repos/{owner}/{repo}/environments \
  -f name="production" \
  -f deployment_branch_policy='{"protected_branches":true}' \
  -f reviewers='[{"type":"Team","id":123}]'
```

### Step 2: Configure Confidence Thresholds

**Edit:** `.github/agents/.agent.md`

```yaml
# Production: Only auto-merge high-confidence fixes
confidence_thresholds:
  auto_merge: 0.95      # ≥95% confidence
  auto_pr: 0.70         # ≥70% confidence
  notify_only: 0.50     # <70% → notify dev only
```

### Step 3: Enable Branch Protection

```bash
# Require PR review for merges
gh api repos/{owner}/{repo}/branches/main/protection \
  -f required_pull_request_reviews='{"required_approving_review_count":1}' \
  -f required_status_checks='{"strict":true,"contexts":["Auto Debugging System"]}'
```

### Step 4: Deploy Agents to Production

```bash
# Verify all files are in place
git add .github/agents
git add .github/workflows
git add .github/error-sources
git add .github/scripts

# Create PR for review
git push origin feature/auto-debugging-system
gh pr create --title "Deploy Auto Debugging System" --body "Closes #XYZ"

# After approval, merge to main
gh pr merge --auto
```

### Step 5: Monitor Production

```bash
# Set up log aggregation
npm run logs:setup

# Watch for auto-fixed errors
npm run auto-fixes:monitor

# Get daily summary
npm run auto-fixes:report --period daily
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check Auto Debugging System health
npm run auto-debug:health

# View recent fixes
npm run auto-fixes:recent --limit 10

# Check error ingestion rate
npm run error-sources:metrics
```

### Weekly Maintenance

```bash
# Analyze fix success rate
npm run auto-fixes:analytics --period weekly

# Update test suite coverage
npm run tests:coverage

# Rotate API credentials (if needed)
npm run secrets:rotate

# Check for new agents/updates
npm run agents:update
```

### Troubleshooting Commands

```bash
# View error ingestion logs
tail -f .github/logs/error-sources.log

# View Auto Debugging System logs
tail -f .github/logs/auto-debug.log

# Check GitHub Actions workflow logs
gh run list --workflow auto-debug-monitor.yml --limit 10

# Test MCP connectivity
npm run mcp:test

# Restart all services
npm run services:restart
```

---

## Performance Tuning

### Optimize Error Ingestion

```json
{
  "global": {
    "max_concurrent_ingestion": 5,      // Reduce for low-power systems
    "batch_size": 50,                   // Larger batch = better throughput
    "deduplicate_window_seconds": 600,  // Longer window = less duplicates
    "error_correlation_window_ms": 5000 // Larger window = better correlation
  }
}
```

### Scale for High Error Volume

```bash
# Use horizontal scaling with worker pools
npm run auto-debug:scale --workers 4

# Monitor worker utilization
npm run workers:monitor

# Adjust based on load
npm run auto-debug:scale --workers 8  # Increase if >80% CPU
```

---

## Rollback Plan

If issues occur, quickly disable Auto Debugging System:

```bash
# Disable error monitoring
npm run error-sources:stop

# Disable auto-PR generation (alert-only mode)
echo "confidence_thresholds:
  auto_merge: 1.0  # Never auto-merge
  auto_pr: 1.0     # Never auto-PR
  notify_only: 0.0 # Alert only" > .github/agents/.agent.md

# Verify no new PRs from auto-debug
gh pr list --state open --search "AUTO-FIX"

# Review and manually fix recent errors
npm run auto-fixes:review --status pending
```

---

## Support & Resources

- 📖 [Complete Pipeline Architecture](./agents/README.md)
- 🔗 [MCP Integration Guide](./MCP-INTEGRATION.md)
- ⚙️ [Error Source Configuration](./error-sources/README.md)
- 🚀 [Quick Start Examples](#quick-start-5-minutes)

---

## Checklist

- [ ] Copied all agent files to `.github/agents/`
- [ ] Created `.env.local` with API credentials
- [ ] Configured error sources (GitHub Actions, Sentry, Datadog)
- [ ] Tested manual error trigger
- [ ] Verified PR generation
- [ ] Set confidence thresholds
- [ ] Configured branch protection
- [ ] Set up monitoring/logging
- [ ] Deployed to production
- [ ] Validated auto-fixes in production

✅ **Deployment Complete!** Your Auto Debugging System is ready to automatically fix bugs 24/7.

---

## Next Steps

1. Monitor the first few auto-fixed PRs carefully
2. Adjust confidence thresholds based on your risk tolerance
3. Expand error sources as needed
4. Share success metrics with your team
5. Consider contributing improvements back to the project

**Questions?** Check the troubleshooting guide or open an issue.
