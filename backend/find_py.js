const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const possiblePaths = [
    'C:\\Python39', 'C:\\Python310', 'C:\\Python311', 'C:\\Python312',
    'C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python'
];

let found = [];

possiblePaths.forEach(p => {
    if (fs.existsSync(p)) {
        if (p.includes('AppData')) {
            const dirs = fs.readdirSync(p);
            dirs.forEach(d => {
                const pyPath = path.join(p, d, 'python.exe');
                if (fs.existsSync(pyPath)) {
                    found.push(pyPath);
                }
            });
        } else {
            const pyPath = path.join(p, 'python.exe');
            if (fs.existsSync(pyPath)) {
                found.push(pyPath);
            }
        }
    }
});

found.forEach(py => {
    try {
        const ver = execSync(`"${py}" --version`).toString().trim();
        console.log(`Found ${ver} at ${py}`);
    } catch (e) {}
});

if (found.length === 0) {
    console.log('No older Python versions found in common directories.');
}
