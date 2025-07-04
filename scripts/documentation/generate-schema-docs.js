process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS' });
require('ts-node/register');
const fs = require('fs');
const path = require('path');
const knexFilePath = path.resolve(__dirname, '../../server/src/knexfile.ts');
const knexConfig = require(knexFilePath).default || require(knexFilePath);

(async () => {
  try {
    const knex = require('knex')(knexConfig.development);
    const inspector = require('knex-schema-inspector').default(knex);
    const tables = await inspector.tables();
    let output = '# Database Schema\n\n';
    for (const table of tables) {
      output += `## ${table}\n`;
      const columns = await inspector.columnInfo(table);
      for (const col of columns) {
        output += `- **${col.name}** \`${col.type}\`${col.is_nullable ? ' nullable' : ''}\n`;
      }
      const fks = await inspector.foreignKeys(table);
      if (fks.length) {
        output += '\n### Foreign Keys\n';
        fks.forEach(fk => {
          output += `- ${fk.column} -> ${fk.foreign_table}.${fk.foreign_column}\n`;
        });
      }
      output += '\n';
    }
    const dest = path.join(__dirname, '../../docs/auto-generated/schema/database-schema.md');
    fs.writeFileSync(dest, output);
    await knex.destroy();
    console.log('Schema docs generated');
  } catch (err) {
    console.error('Failed to generate schema docs:', err);
    process.exitCode = 1;
  }
})();
