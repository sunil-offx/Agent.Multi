# Auto Debugging System - Complete Pipeline Architecture

## Overview

A **5-agent closed-loop debugging pipeline** that automates error detection → root cause analysis → fix generation → validation → PR notification.

**Goal:** Turn manual debugging (hours of tracing) into automated diagnosis + tested fix (minutes).

---

## Agent Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR SOURCE                                  │
│  Logs, crashes, test failures, linter warnings, APM alerts      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│  1️⃣ ERROR MONITORING AGENT                                       │
│     - Ingests errors from multiple sources                       │
│     - Parses & normalizes error data                             │
│     - Classifies by severity (critical/major/minor)              │
│     - Detects recurring patterns in memory                       │
│     - Output: Structured error context                           │
└───────────────────────┬──────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│  2️⃣ ROOT CAUSE ANALYSIS AGENT                                   │
│     - Reads full codebase context                                │
│     - Traces execution flow                                      │
│     - Generates 3+ root cause hypotheses                         │
│     - Ranks by probability                                       │
│     - Output: Diagnosis + fix strategy recommendations           │
└───────────────────────┬──────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│  3️⃣ FIX SUGGESTION AGENT                                        │
│     - Generates 2–4 candidate fixes                              │
│     - Ranks by safety (safest first)                             │
│     - Produces minimal diffs (≤20 lines)                         │
│     - Documents trade-offs                                       │
│     - Output: Code-ready fixes with alternatives                 │
└───────────────────────┬──────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│  4️⃣ TESTING & VALIDATION AGENT                                  │
│     - Runs each fix in isolated sandbox                          │
│     - Executes full test suite                                   │
│     - Measures performance impact                                │
│     - Scores confidence (0–100%)                                 │
│     - Detects regressions                                        │
│     - Output: Validation report + best fix                       │
└───────────────────────┬──────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐
│  5️⃣ NOTIFICATION AGENT (Coordinator)                            │
│     - Receives validation report                                 │
│     - Checks confidence threshold                                │
│     - ≥95%: Auto-raise PR + auto-merge                           │
│     - 70–94%: Notify dev + link PR draft                         │
│     - <70%: Flag for manual review                               │
│     - Output: PR or dev alert                                    │
└───────────────────────┬──────────────────────────────────────────┘
                        │
                        ▼
                    ✅ DONE
                 (Fix applied or reviewed)
```

---

## Agent Details

### Agent 1: Error Monitoring
**File:** `.github/agents/error-monitoring.agent.md`

| Property | Value |
|----------|-------|
| **Role** | Input | 
| **Triggers** | Logs, crashes, test failures, linter warnings |
| **Input** | Raw errors from multiple sources |
| **Output** | Structured error context (JSON) |
| **Scope** | Error triage & normalization |
| **Key Behavior** | Detects recurring patterns, expands context |

---

### Agent 2: Root Cause Analysis
**File:** `.github/agents/root-cause-analysis.agent.md`

| Property | Value |
|----------|-------|
| **Role** | Diagnosis |
| **Triggers** | Error context from Error Monitoring Agent |
| **Input** | Structured error + full codebase |
| **Output** | Root cause diagnosis + fix strategies |
| **Scope** | Deep code analysis, hypothesis generation |
| **Key Behavior** | Multi-hypothesis reasoning, data flow tracing |

---

### Agent 3: Fix Suggestion
**File:** `.github/agents/fix-suggestion.agent.md`

| Property | Value |
|----------|-------|
| **Role** | Generation |
| **Triggers** | Diagnosis from Root Cause Agent |
| **Input** | Root cause + codebase context |
| **Output** | 2–4 candidate fixes with diffs |
| **Scope** | Minimal code generation (≤20 lines per fix) |
| **Key Behavior** | Surgical diffs, ranked by safety, trade-off docs |

---

### Agent 4: Testing & Validation
**File:** `.github/agents/testing-validation.agent.md`

| Property | Value |
|----------|-------|
| **Role** | Validation |
| **Triggers** | Candidate fixes from Fix Agent |
| **Input** | Code fixes + test suite |
| **Output** | Validation report + confidence scores |
| **Scope** | Sandbox testing, performance measurement |
| **Key Behavior** | 0-100% confidence scoring, regression detection |

---

### Agent 5: Notification / Coordinator
**File:** `.agent.md` (main orchestrator)

| Property | Value |
|----------|-------|
| **Role** | Coordination & action |
| **Triggers** | Validation report from Testing Agent |
| **Input** | Confidence score + validation results |
| **Output** | PR / dev notification / manual escalation |
| **Scope** | PR management, human-in-the-loop decision |
| **Key Behavior** | Threshold-based action, never auto-merge |

---

## Confidence Tiers & Actions

```
Confidence | Action                          | Timeline
-----------|--------------------------------|----------
≥ 95%      | Auto-PR + Auto-merge           | Immediate
70–94%     | Auto-PR + Notify dev for review| Immediate
< 70%      | Flag for manual review         | Escalate
```

---

## Example Scenario: TypeError

### Input
```
Error: Cannot read property 'map' of undefined
Location: UserCard.tsx:42
```

### Agent 1: Error Monitoring
```
✅ Parsed error
✅ Classified as MAJOR (test failure)
✅ Detected recurring (3 occurrences)
✅ Extracted context: UserCard.tsx full file + call site
```

### Agent 2: Root Cause Analysis
```
✅ Traced data flow: users → parameter → undefined
✅ Found root cause: missing prop default
✅ Confidence: 95%
✅ Hypothesis #1: Add default parameter (95%)
   Hypothesis #2: Async race condition (4%)
   Hypothesis #3: Type error (1%)
```

### Agent 3: Fix Suggestion
```
✅ Fix #1 (Safest): Add default = [] (1 line, 98% confidence)
✅ Fix #2 (Better): Add null check + UI (5 lines, 96% confidence)
✅ Fix #3 (Type-safe): Mark optional + default (2 lines, 94% confidence)
```

### Agent 4: Testing & Validation
```
✅ Applied Fix #1 in sandbox
✅ Ran 150 tests: 150/150 passed (was 147/150)
✅ No regressions detected
✅ Performance: +0% (no impact)
✅ Confidence: 99%
✅ Status: READY FOR PRODUCTION
```

### Agent 5: Notification
```
✅ Confidence ≥ 95% → AUTO-ACTION ENABLED
✅ Auto-raised PR with full validation report
✅ All tests passed
✅ Confidence: 99%
✅ Ready to auto-merge after dev review
```

---

## How to Use This Pipeline

### Setup
1. Copy all `.agent.md` files to `.github/agents/` in your repo
2. Ensure the Error Monitoring source is configured (logs, CI/CD integration)
3. Verify test suite is comprehensive (good coverage = good fixes)

### Trigger the Pipeline
**Automatically:**
- Error appears in logs → Pipeline runs automatically
- Test fails in CI → Pipeline runs automatically
- Linter warning → Pipeline runs automatically

**Manually:**
- Ask chat: *"There's a TypeError in my React component at line 42. Fix it."*
- Pipeline initiates with manual error context

### Monitor Progress
- **Error Monitoring Agent**: Watch logs/errors being ingested
- **Root Cause Agent**: See diagnosis appear in chat
- **Fix Agent**: Review candidate fixes + trade-offs
- **Testing Agent**: Monitor test results in validation report
- **Notification**: See PR auto-raised or dev alert sent

### Review Output
**High confidence (≥95%):**
- PR auto-raised automatically
- Validation report attached
- All tests passed
- Ready to auto-merge

**Medium confidence (70–94%):**
- PR raised with dev notification
- Validation report included
- Requires human review + approval
- Safe to merge after review

**Low confidence (<70%):**
- Flagged for manual review
- All diagnosis + attempts shown
- Escalated to developer
- Human must investigate

---

## Best Practices

### For Developers
- ✅ Keep test suite comprehensive (better fixes = better validation)
- ✅ Tag errors clearly (helps Error Monitoring parse them)
- ✅ Review PRs from high-confidence fixes (usually safe)
- ✅ Use PRs from medium/low confidence as guidance, not gospel
- ❌ Never auto-merge low-confidence PRs without review

### For Operations
- ✅ Ensure logs are centralized (so Error Monitoring can ingest)
- ✅ Configure CI/CD to feed test failures to pipeline
- ✅ Set reasonable confidence thresholds for your team
- ✅ Monitor pipeline metrics (fix success rate, time saved)
- ❌ Never disable human review for production changes

### For Quality Assurance
- ✅ Validate that generated fixes match your coding standards
- ✅ Spot-check high-confidence fixes
- ✅ Monitor for recurring patterns (if same bug keeps appearing)
- ✅ Update test suite gaps (if agent suggests but tests don't catch)

---

## Performance & Impact

### Before (Manual Debugging)
```
Scenario: TypeError in React component
Timeline:
  0 min:   Error alert (developer notified)
  5 min:   Developer opens logs, reads stack trace
  15 min:  Developer traces code, identifies root cause
  20 min:  Developer writes fix
  25 min:  Developer runs tests manually
  30 min:  Developer creates PR, requests review
  45 min:  Reviewer approves, PR merges
  
Total: 45 minutes
Cost: 1 developer hour wasted on manual debugging
```

### After (Auto Debugging System)
```
Timeline:
  0 sec:   Error alert
  5 sec:   Error Monitoring parses error
  10 sec:  Root Cause Agent diagnoses
  15 sec:  Fix Agent generates candidates
  20 sec:  Testing Agent validates
  25 sec:  Notification Agent raises PR
  
Total: 25 seconds + dev review time
Cost: 0 developer debugging time, only review time
```

**Savings: ~45 minutes per error × 10+ errors/week = 7.5 hours/week saved**

---

## Troubleshooting

### "Pipeline didn't trigger for my error"
- Check: Is error reaching Error Monitoring Agent?
- Check: Does error match expected format?
- Check: Is memory system initialized with similar past errors?

### "Confidence score is too low"
- Reason: Test suite may be incomplete
- Action: Add missing test case to catch this scenario
- Result: Next similar error will have higher confidence

### "Generated fix didn't work"
- Check: Did all tests actually pass?
- Check: Was sandbox environment correct?
- Action: Run tests manually to verify
- Action: Report as issue to improve future fixes

### "Pipeline suggested wrong root cause"
- Reason: Root Cause Agent made incorrect hypothesis
- Action: Provide feedback/correction
- Result: Memory system learns from mistake
- Action: Add test case to prevent recurrence

---

## Next Steps

1. ✅ **Copy all agent files to `.github/agents/`**
2. ✅ **Configure error sources** (logs, CI/CD, APM)
3. ✅ **Set confidence thresholds** (95%/70% or your preference)
4. ✅ **Review first few auto-PRs** manually
5. ✅ **Measure time savings** (track bugs before/after)
6. ✅ **Refine based on feedback** (improve test suite, adjust thresholds)

---

## Questions?

- **"Can I customize agent behavior?"** Yes, edit the `.agent.md` files in `.github/agents/`
- **"Can I disable auto-merge?"** Yes, set confidence threshold to 100% (only alerts)
- **"Can I use this for non-TypeScript projects?"** Yes, edit `applyTo` patterns
- **"What if I don't trust auto-PR?"** Set all PRs to "notify dev" tier (70–94%)
- **"How do I add my own fix strategies?"** Edit Fix Suggestion Agent's "Candidate Fixes" section
