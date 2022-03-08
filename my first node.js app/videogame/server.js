var http = require('http');
const fs = require('fs');
const server = http.createServer(function (request, response) {
    fs.readFile('uloha03.html', (err, data) => {
        if (err) {
            response.writeHead(500);
            response.end('Error loading uloha03.html');
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(data);
        }
    });
});
server.listen(9000, () => {
    console.log('Server running at http://127.0.0.1:9000/');
});