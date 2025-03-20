const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('scripts/addresses.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(worksheet);

const addresses = {
  salutations: [...new Set(jsonData.map(row => row.Salutation))],
  contacts: jsonData.map(row => ({
    salutation: row.Salutation,
    firstname: row.Firstname,
    lastname: row.Lastname,
    email: row.Email,
  })),
};

fs.writeFileSync('public/addresses.json', JSON.stringify(addresses, null, 2));
console.log('Converted addresses.xlsx to public/addresses.json');