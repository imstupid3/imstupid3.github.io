const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Folder to store the Lua code files
const FILE_DIRECTORY = './pastes';

// Create the paste directory if it doesn't exist
if (!fs.existsSync(FILE_DIRECTORY)) {
    fs.mkdirSync(FILE_DIRECTORY);
}

// Route to serve the Pastebin page
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>My Pastebin</h1>
                <form action="/create-paste" method="post">
                    <textarea name="code" placeholder="Enter your Lua code here" rows="10" cols="50"></textarea><br>
                    <input type="text" name="filename" placeholder="Enter filename" /><br>
                    <button type="submit">Save Code</button>
                </form>
            </body>
        </html>
    `);
});

// Route to save the Lua code and generate a raw link
app.post('/create-paste', (req, res) => {
    const code = req.body.code;
    const filename = req.body.filename || 'snippet.lua';
    
    // Save the code to a .lua file
    const filePath = path.join(FILE_DIRECTORY, filename);
    fs.writeFileSync(filePath, code);
    
    // Generate the raw URL for the file
    const rawUrl = `http://localhost:${port}/raw/${filename}`;

    res.send(`
        <p>Code saved! You can now access it via this raw link:</p>
        <a href="${rawUrl}" target="_blank">${rawUrl}</a>
    `);
});

// Route to serve the raw Lua code
app.get('/raw/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(FILE_DIRECTORY, filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
