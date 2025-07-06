const fs = require('fs');
const path = require('path');
const migrationsDir = path.join(__dirname, '../../database/migrations');

function extractMigrationInfo(file) {
  const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
  const up = content.match(/export async function up.*{([\s\S]*?)}/);
  const down = content.match(/export async function down.*{([\s\S]*?)}/);
  return { file, up: up ? up[1].trim() : '', down: down ? down[1].trim() : '' };
}

const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts'));
let output = '# Migration History\n\n';
for (const file of files) {
  const info = extractMigrationInfo(file);
  output += `## ${file}\n\n### Up\n\n\`\`\`ts\n${info.up}\n\`\`\`\n\n### Down\n\n\`\`\`ts\n${info.down}\n\`\`\`\n\n`;
}
fs.writeFileSync(path.join(__dirname, '../../docs/auto-generated/schema/migrations.md'), output);
console.log('Migration docs generated');
