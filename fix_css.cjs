const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf-8');
content = content.replace(/\\n/g, '\n');
fs.writeFileSync('src/index.css', content);
