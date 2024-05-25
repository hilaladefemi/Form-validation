const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Helper function to send a response
function sendResponse(res, statusCode, contentType, content) {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(content);
}

// Function to handle GET requests
function handleGetRequest(req, res) {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    // Set content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                sendResponse(res, 404, 'text/html', '404: File Not Found');
            } else {
                sendResponse(res, 500, 'text/html', `Server Error: ${err.code}`);
            }
        } else {
            sendResponse(res, 200, contentType, content);
        }
    });
}

// Function to handle POST requests
function handlePostRequest(req, res) {

    if (req.url === 'http://locva:3000/submit') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const formData = JSON.parse(body);

                // Read the existing data from database.json
                fs.readFile('database.json', (err, data) => {
                    if (err) {
                        sendResponse(res, 500, 'application/json', JSON.stringify({ success: false, message: 'Error reading database file' }));
                        return;
                    }

                    const database = data.length ? JSON.parse(data) : [];

                    // Add the new form data
                    database.push(formData);

                    // Write the updated data back to database.json
                    fs.writeFile('database.json', JSON.stringify(database, null, 2), (err) => {
                        if (err) {
                            sendResponse(res, 500, 'application/json', JSON.stringify({ success: false, message: 'Error writing to database file' }));
                            return;
                        }

                        sendResponse(res, 200, 'application/json', JSON.stringify({ success: true }));
                    });
                });
            } catch (err) {
                sendResponse(res, 400, 'application/json', JSON.stringify({ success: false, message: 'Invalid JSON' }));
            }
        });
    } else {
        sendResponse(res, 405, 'text/html', 'Method Not Allowed');
    }
}

// Handle HTTP requests
const server = http.createServer((req, res) => {
   
    if (req.method === 'GET') {
        handleGetRequest(req, res);
    } else if (req.method === 'POST') {
       // handlePostRequest(req, res);
       res.end("POST Request")
       return
    } else {
        sendResponse(res, 405, 'text/html', 'Perfect ');
    }
});

server.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`);
});
