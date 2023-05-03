const http = require('http');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Ask for template file path and data file path via console
const templateFilePath = process.argv[2];
const dataFilePath = process.argv[3];

// Check if template file and data file exist
if (!fs.existsSync(templateFilePath)) {
    console.error(`Template file ${templateFilePath} not found`);
    process.exit(1);
}

if (!fs.existsSync(dataFilePath)) {
    console.error(`Data file ${dataFilePath} not found`);
    process.exit(1);
}

// Read the template file and data file
const template = fs.readFileSync(templateFilePath, 'utf8');
const dataExt = path.extname(dataFilePath);

let data;
if (dataExt === '.json') {
    data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
} else if (dataExt === '.yml' || dataExt === '.yaml') {
    data = yaml.load(fs.readFileSync(dataFilePath, 'utf8'));
} else {
    console.error(`Unsupported data file type: ${dataExt}`);
    process.exit(1);
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Replace placeholders in the template with actual data
    let output = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key];
    });

    // Send the HTML response
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(output);
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});