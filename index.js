const express = require('express');
const router = require('./src/router');
const Socket = require('./src/socket');

// Open socket on 5011 port
const socketPort = 5011;
const socket = new Socket(socketPort);
socket.run();

const app = express();

router.init(app);

const hostname = '127.0.0.1';
const port = 5010;

app.listen(port, hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//https://www.aplusclick.org/grade8.htm
