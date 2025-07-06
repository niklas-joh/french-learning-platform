const fs = require('fs');
const path = require('path');
const tree = require('tree-cli');

(async () => {
  const projectTree = await tree({
    base: path.join(__dirname, '../../'),
    exclude: ['node_modules', 'docs']
  });
  const output = `# Developer Guide\n\n## Project Structure\n\n\`\`\`\n${projectTree.report}\n\`\`\`\n`;
  fs.writeFileSync(path.join(__dirname, '../../docs/auto-generated/guides/dev-guide.md'), output);
  console.log('Developer guide generated');
})();
