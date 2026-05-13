const { execSync } = require('child_process');
const fs = require('fs');
let out = '';
try {
  out = execSync('python --version').toString();
} catch (e) {
  out = 'Error: ' + e.message + '\n';
  if (e.stdout) out += 'Stdout: ' + e.stdout.toString() + '\n';
  if (e.stderr) out += 'Stderr: ' + e.stderr.toString() + '\n';
}
fs.writeFileSync('node_py_report.txt', out, 'utf8');
