# Auto Debugging System - MCP Integration Guide

## Overview

This guide explains how to integrate the Auto Debugging System with **Model Context Protocol (MCP) servers** to enable real-time error ingestion from external systems.

---

## Supported Error Sources

### 1. **Sentry Integration** (Crash Reporting)
```mcp
Sentry MCP Server
├── Events API (fetch crash reports)
├── Issues API (get issue details)
├── Releases API (correlate with deploys)
└── Webhook API (real-time alerts)
```

### 2. **GitHub Actions Integration** (CI/CD Test Failures)
```mcp
GitHub Actions MCP Server
├── Workflow Runs API (get CI results)
├── Job Logs API (extract test failures)
├── Artifacts API (retrieve test reports)
└── Webhooks (real-time PR/push events)
```

### 3. **Datadog Integration** (Performance Monitoring)
```mcp
Datadog MCP Server
├── Metrics API (performance data)
├── Logs API (application logs)
├── Error Tracking API (APM errors)
└── Webhooks (anomaly alerts)
```

### 4. **Local Log Aggregation** (Development Logs)
```mcp
File System MCP Server
├── /logs/application.log (app errors)
├── /logs/test-results.json (test suite)
├── /logs/linter-output.json (ESLint/Pylance)
└── File watching (real-time updates)
```

---

## Setup Instructions

### Step 1: Install MCP Servers

**For Node.js environments:**
```bash
# Sentry MCP
npm install -g @modelcontextprotocol/server-sentry

# GitHub Actions MCP
npm install -g @modelcontextprotocol/server-github

# Datadog MCP
npm install -g @modelcontextprotocol/server-datadog
```

### Step 2: Configure MCP in `.mcp-server-config.json`

Create this file in your project root:

```json
{
  "mcpServers": {
    "sentry": {
      "command": "sentry-mcp",
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "your-org",
        "SENTRY_PROJECT": "your-project"
      }
    },
    "github": {
      "command": "github-mcp",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_OWNER": "your-org",
        "GITHUB_REPO": "your-repo"
      }
    },
    "datadog": {
      "command": "datadog-mcp",
      "env": {
        "DD_API_KEY": "${DD_API_KEY}",
        "DD_APP_KEY": "${DD_APP_KEY}",
        "DD_SITE": "us3.datadoghq.com"
      }
    },
    "filesystem": {
      "command": "filesystem-mcp",
      "args": ["--root", "./logs"]
    }
  }
}
```

### Step 3: Set Environment Variables

Create `.env.local`:

```bash
# Sentry
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_org
GITHUB_REPO=your_repo

# Datadog
DD_API_KEY=your_datadog_api_key
DD_APP_KEY=your_datadog_app_key
```

---

## MCP Workflows

### Workflow 1: Fetch Latest Errors from Sentry

```
Error Monitoring Agent
  ↓
Call MCP: sentry.getRecentEvents(project_id)
  ↓
Returns: [
  {
    "id": "1234567890",
    "title": "TypeError: Cannot read property 'map'",
    "level": "error",
    "timestamp": "2026-08-13T10:23:45Z",
    "tags": { "release": "v1.2.3", "environment": "production" }
  },
  ...
]
  ↓
Parse error, pass to Root Cause Agent
```

**MCP Query:**
```json
{
  "method": "sentry.getRecentEvents",
  "params": {
    "project_id": "your-project",
    "limit": 10,
    "tags": { "environment": "production" }
  }
}
```

---

### Workflow 2: Fetch Test Failures from GitHub Actions

```
Error Monitoring Agent
  ↓
Call MCP: github.getWorkflowRuns(workflow_id)
  ↓
Filter: status = "failure"
  ↓
Call MCP: github.getJobLogs(job_id)
  ↓
Parse test failures
  ↓
Extract error messages + line numbers
  ↓
Pass to Root Cause Agent
```

**MCP Query:**
```json
{
  "method": "github.getWorkflowRuns",
  "params": {
    "workflow_id": "tests.yml",
    "status": "failure",
    "limit": 5
  }
}
```

---

### Workflow 3: Real-time Error Webhook

**Setup webhook listener in `.github/webhooks/error-webhook.js`:**

```javascript
const express = require('express');
const app = express();

app.post('/webhook/error', express.json(), (req, res) => {
  const error = req.body;
  
  // Error Monitoring Agent ingests:
  console.log(`[ERROR] ${error.type}: ${error.message}`);
  console.log(`[LOCATION] ${error.file}:${error.line}`);
  console.log(`[TIMESTAMP] ${error.timestamp}`);
  
  // Trigger Auto Debugging System pipeline
  const { AutoDebuggingSystem } = require('../agents');
  AutoDebuggingSystem.ingestError(error);
  
  res.status(200).json({ status: 'received' });
});

app.listen(3000, () => {
  console.log('Error webhook listening on port 3000');
});
```

**Configure webhooks in services:**

- **Sentry**: Settings → Integrations → Webhooks → `http://localhost:3000/webhook/error`
- **GitHub**: Settings → Webhooks → Events → `Workflow runs` → `http://localhost:3000/webhook/error`
- **Datadog**: Monitors → New Monitor → Webhook Notification → `http://localhost:3000/webhook/error`

---

## MCP Resource Mapping

| Error Source | MCP Resource | Error Monitoring Agent Call |
|--------------|--------------|---------------------------|
| **Sentry** | `sentry.events` | `getMostRecentEvents()` |
| **GitHub Actions** | `github.workflow-runs` | `getFailedRuns()` |
| **Datadog** | `datadog.error-tracking` | `getAnomalies()` |
| **Logs** | `filesystem.logs` | `watchLogs()` |

---

## Error Normalization

**Each MCP source returns different formats. Error Monitoring Agent normalizes:**

```json
{
  "error_id": "auto-gen-uid",
  "message": "TypeError: Cannot read property 'map' of undefined",
  "type": "runtime_error",
  "severity": "major",
  "component": "UserCard",
  "location": "UserCard.tsx:42",
  "source": "sentry",
  "source_id": "1234567890",
  "stack_trace": [...],
  "timestamp": "2026-08-13T10:23:45Z",
  "environment": "production",
  "metadata": {
    "release": "v1.2.3",
    "user_impact": true,
    "frequency": 3
  }
}
```

---

## Webhook Configuration Examples

### Sentry Webhook Payload
```json
{
  "action": "created",
  "data": {
    "event": {
      "event_id": "1234567890",
      "message": "TypeError: Cannot read property 'map' of undefined",
      "timestamp": "2026-08-13T10:23:45.123456Z",
      "level": "error",
      "exception": {
        "values": [
          {
            "type": "TypeError",
            "value": "Cannot read property 'map' of undefined",
            "stacktrace": {
              "frames": [...]
            }
          }
        ]
      }
    }
  }
}
```

### GitHub Actions Webhook Payload
```json
{
  "action": "completed",
  "workflow_run": {
    "id": 123456,
    "name": "Run Tests",
    "conclusion": "failure",
    "head_branch": "main",
    "run_number": 42,
    "artifacts_url": "..."
  }
}
```

---

## Testing the Integration

### Test 1: Manually Trigger Error
```bash
# Send test error to webhook
curl -X POST http://localhost:3000/webhook/error \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test error from webhook",
    "type": "runtime_error",
    "file": "test.tsx",
    "line": 42
  }'

# Expected response:
# { "status": "received" }
```

### Test 2: Fetch from Sentry MCP
```bash
# Query recent Sentry events
node -e "
const mcp = require('@modelcontextprotocol/client');
const sentry = mcp.connect('sentry');
sentry.call('getRecentEvents', { limit: 5 }).then(console.log);
"
```

### Test 3: Monitor CI/CD
```bash
# Watch GitHub Actions runs
gh run list --workflow=tests.yml --status=failure --limit=5 --json=conclusion,databaseId,name,headBranch
```

---

## Performance Considerations

### Rate Limiting
```javascript
// Add exponential backoff for API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await delay(Math.pow(2, i) * 1000);
    }
  }
};
```

### Caching
```javascript
// Cache error context to avoid repeated MCP calls
const errorCache = new Map();
const getCachedError = (errorId, ttl = 3600000) => {
  const cached = errorCache.get(errorId);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
};
```

### Batch Processing
```javascript
// Batch errors for efficiency
const batchErrors = (errors, batchSize = 10) => {
  return errors.reduce((batches, error, i) => {
    if (i % batchSize === 0) batches.push([]);
    batches[batches.length - 1].push(error);
    return batches;
  }, []);
};
```

---

## Troubleshooting

### Issue: "MCP Server not responding"
```bash
# Check if server is running
ps aux | grep mcp

# Restart MCP server
npm restart-mcp-servers

# Check logs
tail -f ~/.mcp-logs/mcp.log
```

### Issue: "Authentication failed"
```bash
# Verify environment variables
echo $SENTRY_AUTH_TOKEN
echo $GITHUB_TOKEN

# Test API access directly
curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  https://sentry.io/api/0/projects/your-org/your-project/events/
```

### Issue: "Webhook not receiving events"
```bash
# Expose local webhook for testing
npm install -g ngrok
ngrok http 3000
# Use ngrok URL in webhook configuration
```

---

## Next Steps

1. ✅ Install MCP servers for your error sources
2. ✅ Configure `.mcp-server-config.json` with API credentials
3. ✅ Setup webhook listeners in `.github/webhooks/`
4. ✅ Test integration with manual error trigger
5. ✅ Monitor error ingestion in real-time
6. ✅ Adjust error sources based on your stack

Once configured, the Auto Debugging System will automatically ingest errors from all sources and run the full 5-stage pipeline!
