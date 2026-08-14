#!/usr/bin/env node

/**
 * Parse test failures from Jest/Vitest JSON report
 * Converts test output to normalized error format for Auto Debugging System
 * 
 * Usage: node parse-test-failures.js <test-results.json>
 */

const fs = require('fs');
const path = require('path');

function parseTestFailures(testResultsPath) {
  try {
    const testResults = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));
    const errors = [];

    // Parse Jest/Vitest format
    if (testResults.testResults) {
      testResults.testResults.forEach(file => {
        file.assertionResults?.forEach(test => {
          if (test.status === 'failed') {
            // Extract error message and location
            const failureMessage = test.failureMessages?.[0] || 'Test failed (no message)';
            const [message, ...stackLines] = failureMessage.split('\n');
            
            // Parse stack trace to find file/line
            const stackMatch = stackLines.find(line => line.includes('.tsx') || line.includes('.ts'));
            const locationMatch = stackMatch?.match(/(?:at\s+)?(.+?):(\d+):(\d+)/);
            
            errors.push({
              error_id: `test-${Date.now()}-${Math.random()}`,
              message: message.trim(),
              type: 'test_failure',
              severity: 'major',
              component: path.basename(file.name, path.extname(file.name)),
              location: {
                file: file.name,
                line: locationMatch ? parseInt(locationMatch[2]) : 0,
                function: test.fullName
              },
              source: {
                type: 'github-actions',
                id: process.env.GITHUB_RUN_ID,
                url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
              },
              stack_trace: stackLines.map(line => ({
                raw: line
              })),
              timestamp: new Date().toISOString(),
              environment: 'ci',
              metadata: {
                test_name: test.fullName,
                test_file: file.name,
                duration_ms: test.duration
              }
            });
          }
        });
      });
    }

    // Output normalized errors
    console.log(JSON.stringify(errors, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(`Failed to parse test results: ${error.message}`);
    process.exit(1);
  }
}

const testResultsPath = process.argv[2];
if (!testResultsPath) {
  console.error('Usage: node parse-test-failures.js <test-results.json>');
  process.exit(1);
}

parseTestFailures(testResultsPath);
