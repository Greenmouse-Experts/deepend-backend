/*var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});
server.listen();*/


const app = require('./app');
const db = require('./config/config');
require('dotenv').config()

db.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.log('Error: ' + err ))

db.sync();



const port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log(`listening to port ${port}, at http://localhost:${port}}`)
})