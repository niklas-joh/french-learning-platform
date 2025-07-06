const { execSync } = require('child_process');

try {
  execSync('readmeai --repository . --output README-GENERATED.md', { stdio: 'inherit' });
  console.log('README generated using README-AI');
} catch (err) {
  console.error('Failed to generate README:', err);
  process.exitCode = 1;
}
