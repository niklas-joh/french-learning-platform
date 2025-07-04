const fs = require('fs');
const { execSync } = require('child_process');

function checkDependency(cmd) {
  try {
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const requiredCommands = ['readmeai', 'dbml2sql', 'documentation', 'tree'];
const missing = requiredCommands.filter(cmd => !checkDependency(`${cmd} --version`));

const dirs = [
  'docs/auto-generated/schema',
  'docs/auto-generated/api',
  'docs/auto-generated/complexity',
  'docs/auto-generated/architecture',
  'docs/auto-generated/guides',
  'docs/auto-generated/reports'
];

const missingDirs = dirs.filter(d => !fs.existsSync(d));

if (missing.length === 0 && missingDirs.length === 0) {
  console.log('Documentation setup validation passed');
} else {
  console.error('Validation issues:');
  if (missing.length) console.error('Missing commands:', missing.join(', '));
  if (missingDirs.length) console.error('Missing directories:', missingDirs.join(', '));
  process.exitCode = 1;
}
