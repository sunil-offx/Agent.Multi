#!/usr/bin/env node

/**
 * Wait for Auto Debugging System to raise a PR
 * Polls GitHub for new PR with auto-fix markers
 * 
 * Usage: node wait-for-pr.js --branch <branch-name> --timeout <seconds>
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const BRANCH = argv.branch || `auto-fix-${Date.now()}`;
const TIMEOUT = (argv.timeout || 300) * 1000; // Convert to ms
const POLL_INTERVAL = 5000; // Check every 5 seconds

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function waitForPR() {
  const startTime = Date.now();
  
  console.log(`⏳ Waiting for Auto Debugging System to raise PR on branch: ${BRANCH}`);
  console.log(`⏱️  Timeout: ${TIMEOUT / 1000} seconds\n`);

  while (Date.now() - startTime < TIMEOUT) {
    try {
      // List all PRs for the repository
      const { data: prs } = await octokit.pulls.list({
        owner: process.env.GITHUB_REPOSITORY.split('/')[0],
        repo: process.env.GITHUB_REPOSITORY.split('/')[1],
        state: 'open',
        per_page: 10
      });

      // Look for auto-fix PR
      const autoPR = prs.find(pr => 
        pr.title.includes('[AUTO-FIX]') && 
        (pr.head.ref === BRANCH || pr.title.includes('Auto-fix'))
      );

      if (autoPR) {
        console.log(`✅ Auto-fix PR found!`);
        console.log(`   Title: ${autoPR.title}`);
        console.log(`   URL: ${autoPR.html_url}`);
        console.log(`   Branch: ${autoPR.head.ref}`);

        // Save result
        const result = {
          status: 'success',
          pr_number: autoPR.number,
          pr_url: autoPR.html_url,
          branch: autoPR.head.ref,
          title: autoPR.title,
          confidence: extractConfidence(autoPR.body),
          fixes_applied: extractFixCount(autoPR.body)
        };

        fs.writeFileSync('auto-fix-result.json', JSON.stringify(result, null, 2));
        console.log('\n✨ Auto-fix PR ready for review!');
        process.exit(0);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      console.log(`⏳ Still waiting... (${elapsedSeconds}s elapsed)`);

    } catch (error) {
      console.error(`Error checking for PR: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  // Timeout reached
  console.log(`\n⚠️  Timeout reached - no auto-fix PR found within ${TIMEOUT / 1000} seconds`);
  
  const result = {
    status: 'timeout',
    message: 'Auto Debugging System did not raise a PR within the timeout period',
    elapsed_seconds: TIMEOUT / 1000
  };

  fs.writeFileSync('auto-fix-result.json', JSON.stringify(result, null, 2));
  process.exit(1);
}

function extractConfidence(prBody) {
  const match = prBody?.match(/Confidence[:\s]+(\d+)%/i);
  return match ? parseInt(match[1]) : 0;
}

function extractFixCount(prBody) {
  const match = prBody?.match(/fixes?[:\s]+(\d+)/i);
  return match ? parseInt(match[1]) : 1;
}

waitForPR().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
