const { execSync } = require('child_process');
try {
  console.log(execSync('python --version').toString());
} catch (e) {
  console.log('Error:', e.message);
  if (e.stdout) console.log('Stdout:', e.stdout.toString());
  if (e.stderr) console.log('Stderr:', e.stderr.toString());
}
