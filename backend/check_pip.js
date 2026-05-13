const { execSync } = require('child_process');
const fs = require('fs');
let out = '';
try {
  out = execSync('.\\venv\\Scripts\\pip.exe install -r requirements.txt', { stdio: 'pipe' }).toString();
} catch (e) {
  out = 'Error: ' + e.message + '\n';
  if (e.stdout) out += 'Stdout:\n' + e.stdout.toString() + '\n';
  if (e.stderr) out += 'Stderr:\n' + e.stderr.toString() + '\n';
}
fs.writeFileSync('pip_report.txt', out, 'utf8');
