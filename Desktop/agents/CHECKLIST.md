# Auto Debugging System - Setup Checklist

Complete this checklist to ensure your Auto Debugging System is properly configured and ready for production use.

---

## ✅ Phase 1: Core Setup (Required)

- [ ] **Create required directories**
  ```bash
  mkdir -p .github/{agents,workflows,scripts,error-sources,logs,hooks}
  ```

- [ ] **Copy coordinator agent**
  - [ ] `.agent.md` → repo root
  - File should be: ~150 lines with 5 phases documented

- [ ] **Copy specialized agents**
  - [ ] `error-monitoring.agent.md` → `.github/agents/`
  - [ ] `root-cause-analysis.agent.md` → `.github/agents/`
  - [ ] `fix-suggestion.agent.md` → `.github/agents/`
  - [ ] `testing-validation.agent.md` → `.github/agents/`
  - [ ] `README.md` → `.github/agents/`
  - Each file should be 200-300 lines with detailed sections

- [ ] **Copy CI/CD workflow**
  - [ ] `auto-debug-monitor.yml` → `.github/workflows/`
  - Should trigger on test failures and workflow completions

- [ ] **Copy scripts**
  - [ ] `parse-test-failures.js` → `.github/scripts/`
  - [ ] `wait-for-pr.js` → `.github/scripts/`
  - Make executable: `chmod +x .github/scripts/*.js`

- [ ] **Verify file structure**
  ```bash
  ls -la .agent.md
  ls -la .github/agents/*.agent.md
  ls -la .github/workflows/auto-debug-monitor.yml
  ls -la .github/scripts/*.js
  ```

---

## ✅ Phase 2: Configuration

- [ ] **Create error source configs**
  - [ ] `.github/error-sources/README.md` copied
  - [ ] Create `.github/error-sources/github-actions.config.json`
  - [ ] (Optional) Create `.github/error-sources/sentry.config.json`
  - [ ] (Optional) Create `.github/error-sources/datadog.config.json`

- [ ] **Create MCP configuration**
  - [ ] `.mcp-server-config.json` exists in repo root
  - [ ] Contains github and other MCP server configs
  - [ ] Environment variables reference ${...} placeholders

- [ ] **Create environment file**
  - [ ] `.env.local` created with API credentials
  - [ ] Added to `.gitignore` (don't commit secrets!)
  - [ ] Contains:
    - [ ] GITHUB_TOKEN
    - [ ] (Optional) SENTRY_AUTH_TOKEN
    - [ ] (Optional) DD_API_KEY

- [ ] **Verify credentials**
  ```bash
  echo $GITHUB_TOKEN          # Should show token
  echo $SENTRY_AUTH_TOKEN     # Should show token (if configured)
  echo $DD_API_KEY            # Should show key (if configured)
  ```

---

## ✅ Phase 3: Documentation

- [ ] **Main documentation exists**
  - [ ] `README.md` at repo root
  - [ ] Contains quick start + full setup sections
  - [ ] Contains architecture overview

- [ ] **Setup guide exists**
  - [ ] `DEPLOYMENT.md` at repo root
  - [ ] Contains step-by-step setup instructions
  - [ ] Contains troubleshooting section

- [ ] **MCP integration guide exists**
  - [ ] `.github/MCP-INTEGRATION.md` exists
  - [ ] Contains Sentry, GitHub, Datadog setup

- [ ] **Error source guide exists**
  - [ ] `.github/error-sources/README.md` exists
  - [ ] Contains config templates for all sources

- [ ] **Architecture guide exists**
  - [ ] `.github/agents/README.md` exists
  - [ ] Contains 5-stage pipeline diagram
  - [ ] Contains agent details table

---

## ✅ Phase 4: GitHub Secrets & Actions

- [ ] **GitHub secrets configured**
  - [ ] `GITHUB_TOKEN` exists in repo secrets
  - [ ] (Optional) `SENTRY_AUTH_TOKEN` exists
  - [ ] (Optional) `DD_API_KEY` exists
  - [ ] (Optional) `AUTO_DEBUG_WEBHOOK` exists (for webhook mode)

- [ ] **GitHub Actions enabled**
  - [ ] Settings → Actions → General → Allow all actions
  - [ ] Settings → Actions → Runners → Default available

- [ ] **Workflow permissions**
  - [ ] Settings → Actions → General → Workflow permissions
  - [ ] "Read and write permissions" selected
  - [ ] Allow GitHub Actions to create and approve pull requests

- [ ] **Branch protection (optional, for production)**
  - [ ] Settings → Branches → Branch protection rule
  - [ ] Require pull request reviews: 1
  - [ ] Require status checks to pass: Yes
  - [ ] Require branches to be up to date: Yes

---

## ✅ Phase 5: Testing & Verification

- [ ] **Test manual error trigger**
  ```bash
  # Trigger workflow manually
  gh workflow run auto-debug-monitor.yml \
    -f error_message="Test error from setup"
  
  # Watch execution
  gh run watch
  ```
  - [ ] Workflow starts within 30 seconds
  - [ ] Workflow completes (success or failure is ok for testing)
  - [ ] No authentication errors

- [ ] **Verify file parsing**
  ```bash
  # Test parse script
  node .github/scripts/parse-test-failures.js test-results.json
  ```
  - [ ] Script runs without errors
  - [ ] Outputs JSON with error array

- [ ] **Test error ingestion**
  - [ ] Errors appear in logs: `npm run error-sources:recent`
  - [ ] (Optional) Manual webhook test:
    ```bash
    curl -X POST http://localhost:3000/webhook/error \
      -H "Content-Type: application/json" \
      -d '{"message":"test","type":"runtime_error"}'
    ```
  - [ ] Webhook responds with HTTP 200

- [ ] **Verify agent responses**
  - [ ] Error Monitoring Agent processes errors
  - [ ] Root Cause Agent analyzes code
  - [ ] Fix Suggestion Agent generates fixes
  - [ ] Testing Agent validates
  - [ ] Coordinator decides action

---

## ✅ Phase 6: Integration (Optional - for real-time errors)

- [ ] **Sentry integration (optional)**
  - [ ] Account created at sentry.io
  - [ ] Auth token generated
  - [ ] `SENTRY_AUTH_TOKEN` set in `.env.local`
  - [ ] `SENTRY_ORG` and `SENTRY_PROJECT` set
  - [ ] Webhook configured in Sentry:
    - [ ] Settings → Integrations → Webhook
    - [ ] URL: `http://localhost:3000/webhook/error` (or ngrok URL)
    - [ ] Events: All

- [ ] **GitHub Actions integration**
  - [ ] Workflow file created: `.github/workflows/auto-debug-monitor.yml`
  - [ ] Workflow triggers on test failures
  - [ ] Workflow triggers on push to main/develop
  - [ ] Workflow has permission to create PRs

- [ ] **Datadog integration (optional)**
  - [ ] Account created at datadog.com
  - [ ] API key generated
  - [ ] App key generated
  - [ ] `DD_API_KEY` and `DD_APP_KEY` set in `.env.local`
  - [ ] Webhook configured in Datadog:
    - [ ] Monitors → New Monitor → Webhook notification
    - [ ] URL: `http://localhost:3000/webhook/error`

- [ ] **Local webhook setup (optional, for development)**
  - [ ] `.github/webhooks/error-webhook.js` created
  - [ ] Express server can be started: `node .github/webhooks/error-webhook.js`
  - [ ] Webhook listens on port 3000
  - [ ] Test with curl (see Phase 5)

---

## ✅ Phase 7: Monitoring & Logs

- [ ] **Log directories exist**
  - [ ] `.github/logs/` directory exists
  - [ ] `.gitignore` includes `.github/logs/**`

- [ ] **Monitoring setup (optional)**
  - [ ] `npm run auto-debug:health` command works
  - [ ] `npm run error-sources:status` command works
  - [ ] `npm run auto-fixes:recent` command works

- [ ] **Log monitoring enabled**
  - [ ] Can view error source logs: `tail -f .github/logs/error-sources.log`
  - [ ] Can view auto-debug logs: `tail -f .github/logs/auto-debug.log`

---

## ✅ Phase 8: Production Safety Gates

- [ ] **Confidence thresholds configured**
  - [ ] `.agent.md` has `confidence_thresholds` section
  - [ ] `auto_merge: 0.95` (only ≥95%)
  - [ ] `auto_pr: 0.70` (70-94%)
  - [ ] `notify_only: 0.50` (<70%)

- [ ] **Tool restrictions in place**
  - [ ] Each agent has `tools_allowed` section
  - [ ] Each agent has `tools_forbidden` section
  - [ ] Agents cannot execute arbitrary code
  - [ ] Agents cannot auto-merge

- [ ] **Branch protection configured**
  - [ ] Main branch requires PR review
  - [ ] Tests must pass before merge
  - [ ] Auto-fix PRs still require human approval

- [ ] **Rollback plan documented**
  - [ ] Know how to stop Auto Debugging System
  - [ ] Know how to disable auto-PRs (notify-only mode)
  - [ ] Know how to manually review pending PRs

---

## ✅ Phase 9: Documentation Review

- [ ] **User guides exist and are readable**
  - [ ] `README.md` - Main overview ✓
  - [ ] `DEPLOYMENT.md` - Setup instructions ✓
  - [ ] `.github/agents/README.md` - Architecture ✓
  - [ ] `.github/error-sources/README.md` - Config ✓
  - [ ] `.github/MCP-INTEGRATION.md` - Integration ✓

- [ ] **Documentation is current**
  - [ ] File paths match actual structure
  - [ ] API endpoints are correct
  - [ ] Commands have correct syntax
  - [ ] Examples are runnable

- [ ] **Team knows how to use it**
  - [ ] Team has read `README.md`
  - [ ] Team understands 5-stage pipeline
  - [ ] Team knows confidence thresholds
  - [ ] Team knows how to review auto-fix PRs

---

## ✅ Phase 10: First Run & Monitoring

- [ ] **First error processed successfully**
  - [ ] Error detected by Error Monitoring Agent
  - [ ] Root cause identified by Root Cause Agent
  - [ ] Fixes generated by Fix Suggestion Agent
  - [ ] Validated by Testing Agent
  - [ ] Decision made by Coordinator Agent

- [ ] **First auto-fix PR created**
  - [ ] PR title contains `[AUTO-FIX]`
  - [ ] PR body contains diagnosis + confidence score
  - [ ] PR body contains fix description
  - [ ] PR requires human review before merge
  - [ ] CI/CD tests pass for auto-fix

- [ ] **Team reviews first PR**
  - [ ] Review takes < 10 minutes
  - [ ] Fix is validated as correct
  - [ ] PR is merged successfully
  - [ ] Bug is fixed in production

- [ ] **Success metrics tracked**
  - [ ] Time to detect error
  - [ ] Time to diagnose (auto)
  - [ ] Time to generate fix (auto)
  - [ ] Time for human review
  - [ ] Time to fix (total)

---

## 📊 Success Criteria

### Setup is Complete When:

✅ All phases 1-10 checkboxes are checked  
✅ Core agents are responding to errors  
✅ At least one auto-fix PR has been created  
✅ Team has reviewed and approved an auto-fix  
✅ Documentation is accessible to team  

### Performance Targets:

✅ Error detection: < 1 minute  
✅ Auto-fix generation: < 30 seconds  
✅ Testing & validation: < 1 minute  
✅ Human review time: 5-10 minutes  
✅ Total time to fix: 10-15 minutes (vs 45+ manual)  

---

## 🆘 Troubleshooting During Setup

| Issue | Check | Fix |
|-------|-------|-----|
| Workflow doesn't run | Is `.github/workflows/` correct? | Check YAML syntax with `yamllint` |
| No agents responding | Are `.agent.md` files in right place? | Verify `.github/agents/` structure |
| Secrets not accessible | Are GitHub secrets set? | Check Settings → Secrets |
| Errors not ingested | Is error source config correct? | Check `.env.local` and API keys |
| No PRs created | Is confidence high enough? | Check threshold in `.agent.md` |
| Tests failing | Is sandbox environment correct? | Check Node version and dependencies |

---

## 📞 Getting Help

- Read relevant doc: DEPLOYMENT.md → MCP-INTEGRATION.md → .github/agents/README.md
- Check troubleshooting section in DEPLOYMENT.md
- Review error logs: `tail -f .github/logs/*.log`
- Test connectivity: `npm run error-sources:test`
- Run health check: `npm run auto-debug:health`

---

## ✨ Next Steps After Setup

1. ✅ Let system run for 1 week - collect metrics
2. ✅ Review auto-fixes for accuracy
3. ✅ Adjust confidence thresholds if needed
4. ✅ Add more error sources (Sentry, Datadog)
5. ✅ Share success metrics with team
6. ✅ Consider expanding to other teams/projects

---

## Completed Setup Date: _______________

**Signed off by:** _______________

**Team:** _______________

---

🎉 **Congratulations!** Your Auto Debugging System is ready to automatically fix bugs 24/7!
