const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcDir = path.join(__dirname, '../../server/src');

function findKnexUsage() {
  const files = glob.sync('**/*.ts', { cwd: srcDir });
  let patterns = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
    if (/knex\(/.test(content)) {
      patterns.push(`- ${file}`);
    }
  }
  return patterns;
}

(function run() {
  const usage = findKnexUsage();
  let output = '# Code Patterns\n\n';
  output += '## Files using Knex\n';
  output += usage.join('\n');
  fs.writeFileSync(path.join(__dirname, '../../docs/auto-generated/guides/code-patterns.md'), output);
  console.log('Code pattern analysis complete');
})();
