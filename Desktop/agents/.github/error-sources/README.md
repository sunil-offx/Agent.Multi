# Error Source Configuration

This directory contains configuration templates for connecting the Auto Debugging System to various error sources.

## Quick Start

Copy the relevant config file for your error source and fill in your API credentials:

```bash
# Copy template
cp .github/error-sources/sentry.config.example.json .github/error-sources/sentry.config.json

# Fill in credentials
# Then load it in your error monitoring agent
```

---

## Configuration Files

### 1. Sentry Configuration
**File:** `sentry.config.json`

```json
{
  "enabled": true,
  "api": {
    "url": "https://sentry.io/api/0",
    "auth_token": "${SENTRY_AUTH_TOKEN}",
    "organization": "your-org",
    "project": "your-project"
  },
  "ingestion": {
    "poll_interval_seconds": 60,
    "filter": {
      "environment": ["staging", "production"],
      "level": ["error", "fatal"],
      "exclude_tags": ["ignored"]
    },
    "max_events_per_poll": 50
  },
  "alert_thresholds": {
    "critical": {
      "event_count": 5,
      "time_window_minutes": 10
    },
    "major": {
      "event_count": 10,
      "time_window_minutes": 60
    }
  }
}
```

**Usage:**
```javascript
const SentryErrorSource = require('./error-sources/sentry');
const monitor = new SentryErrorSource('sentry.config.json');
monitor.start(); // Polls Sentry every 60 seconds
```

---

### 2. GitHub Actions Configuration
**File:** `github-actions.config.json`

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
    },
    {
      "name": "lint.yml",
      "include_on_failure": true,
      "parse_logs": true
    },
    {
      "name": "build.yml",
      "include_on_failure": true,
      "parse_logs": false
    }
  ],
  "ingestion": {
    "poll_interval_seconds": 30,
    "filter": {
      "status": ["failure"],
      "branches": ["main", "develop"],
      "conclusion": ["failure", "timed_out"]
    },
    "max_runs_per_poll": 20
  },
  "alert_thresholds": {
    "first_failure": true,
    "consecutive_failures": 2
  }
}
```

**Usage:**
```javascript
const GitHubErrorSource = require('./error-sources/github-actions');
const monitor = new GitHubErrorSource('github-actions.config.json');
monitor.watchWorkflows();
```

---

### 3. Datadog Configuration
**File:** `datadog.config.json`

```json
{
  "enabled": true,
  "api": {
    "url": "https://us3.datadoghq.com/api/v2",
    "api_key": "${DD_API_KEY}",
    "app_key": "${DD_APP_KEY}",
    "site": "us3"
  },
  "error_tracking": {
    "enabled": true,
    "poll_interval_seconds": 60,
    "filters": {
      "service": ["web-frontend", "api-backend"],
      "environment": ["staging", "production"],
      "status": ["error", "critical"]
    }
  },
  "logs": {
    "enabled": true,
    "query": "status:error source:application",
    "poll_interval_seconds": 30
  },
  "metrics": {
    "enabled": true,
    "alert_on": [
      {
        "metric": "trace.web.request.duration",
        "threshold": 1000,
        "condition": "above",
        "alert_level": "warning"
      }
    ]
  },
  "webhooks": {
    "enabled": true,
    "endpoint": "http://localhost:3000/webhook/datadog"
  }
}
```

**Usage:**
```javascript
const DatadogErrorSource = require('./error-sources/datadog');
const monitor = new DatadogErrorSource('datadog.config.json');
monitor.start();
```

---

### 4. Local Logs Configuration
**File:** `local-logs.config.json`

```json
{
  "enabled": true,
  "log_sources": [
    {
      "name": "application",
      "path": "./logs/application.log",
      "format": "json",
      "watch": true,
      "error_patterns": [
        "ERROR",
        "Exception",
        "Failed",
        "TypeError",
        "ReferenceError"
      ]
    },
    {
      "name": "test-results",
      "path": "./logs/test-results.json",
      "format": "json",
      "watch": false,
      "poll_interval_seconds": 30,
      "filter": {
        "status": "failed"
      }
    },
    {
      "name": "linter-output",
      "path": "./logs/linter-output.json",
      "format": "json",
      "watch": false,
      "poll_interval_seconds": 60,
      "filter": {
        "severity": ["error", "warning"]
      }
    }
  ],
  "ingestion": {
    "batch_size": 100,
    "deduplicate": true,
    "deduplicate_window_seconds": 300
  }
}
```

**Usage:**
```javascript
const LocalLogsSource = require('./error-sources/local-logs');
const monitor = new LocalLogsSource('local-logs.config.json');
monitor.start();
```

---

## Multi-Source Setup

**File:** `.github/error-sources/all-sources.config.json`

Enable all error sources simultaneously:

```json
{
  "sources": [
    {
      "type": "sentry",
      "enabled": true,
      "config_file": "./sentry.config.json"
    },
    {
      "type": "github-actions",
      "enabled": true,
      "config_file": "./github-actions.config.json"
    },
    {
      "type": "datadog",
      "enabled": true,
      "config_file": "./datadog.config.json"
    },
    {
      "type": "local-logs",
      "enabled": true,
      "config_file": "./local-logs.config.json"
    }
  ],
  "global": {
    "deduplicate_across_sources": true,
    "error_correlation_window_ms": 5000,
    "max_concurrent_ingestion": 10
  }
}
```

**Usage:**
```javascript
const MultiSourceMonitor = require('./error-sources/multi-source');
const monitor = new MultiSourceMonitor('all-sources.config.json');
monitor.start();
```

---

## Normalized Error Schema

All sources are normalized to this common format:

```json
{
  "error_id": "uid-auto-generated",
  "message": "TypeError: Cannot read property 'map' of undefined",
  "type": "runtime_error",
  "severity": "major",
  "component": "UserCard",
  "location": {
    "file": "UserCard.tsx",
    "line": 42,
    "function": "render"
  },
  "source": {
    "type": "sentry",
    "id": "1234567890",
    "url": "https://sentry.io/issues/1234567890/"
  },
  "stack_trace": [
    {
      "file": "UserCard.tsx",
      "line": 42,
      "function": "render",
      "context": "..."
    }
  ],
  "timestamp": "2026-08-13T10:23:45Z",
  "environment": "production",
  "frequency": 3,
  "first_seen": "2026-08-11T15:00:00Z",
  "last_seen": "2026-08-13T10:23:45Z",
  "metadata": {
    "release": "v1.2.3",
    "user_impact": true,
    "affected_users": 42
  }
}
```

---

## Testing Configuration

**Test your configuration before deployment:**

```bash
# Test Sentry connection
npm test -- --config ./sentry.config.json

# Test GitHub Actions connection
npm test -- --config ./github-actions.config.json

# Test Datadog connection
npm test -- --config ./datadog.config.json

# Test local logs
npm test -- --config ./local-logs.config.json
```

---

## Environment Variables

**Create `.env` for sensitive credentials:**

```bash
# Sentry
SENTRY_AUTH_TOKEN=sntr_your_token_here
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# GitHub
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo

# Datadog
DD_API_KEY=your_api_key_here
DD_APP_KEY=your_app_key_here

# Local
LOG_PATH=./logs
```

**Load in monitoring:**

```javascript
require('dotenv').config();

const sentryConfig = {
  api_token: process.env.SENTRY_AUTH_TOKEN,
  organization: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT
};
```

---

## Monitoring Health

**Check error source health:**

```bash
# View active sources
npm run error-sources:status

# View recent errors ingested
npm run error-sources:recent --limit=10

# View error ingestion rate
npm run error-sources:stats

# Restart all sources
npm run error-sources:restart
```

---

## Troubleshooting

### No errors being ingested
1. Check API credentials in config files
2. Verify environment variables are loaded
3. Check error source logs: `tail -f .github/logs/error-sources.log`
4. Test connectivity: `npm run error-sources:test`

### Performance issues
1. Reduce `poll_interval_seconds` if less frequent polling is ok
2. Reduce `max_events_per_poll` to batch smaller
3. Enable `deduplicate` to reduce duplicate ingestion
4. Monitor CPU/memory: `npm run error-sources:monitor`

### Missing errors from specific source
1. Check filters in config (are they too restrictive?)
2. Verify error format matches expected schema
3. Check error logging in source (is it capturing errors?)
4. Enable debug logging: `DEBUG=* npm run error-sources:start`

---

## Next Steps

1. ✅ Choose your error sources
2. ✅ Copy relevant config files
3. ✅ Fill in API credentials
4. ✅ Test connectivity
5. ✅ Start monitoring: `npm run error-sources:start`
6. ✅ Watch Auto Debugging System auto-fix errors!
