const fs = require('fs');

const text = fs.readFileSync('scripts/template.txt', 'utf8');
const template = { template: text };

fs.writeFileSync('public/template.json', JSON.stringify(template, null, 2));
console.log('Converted template.txt to public/template.json');