const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./src/config/main');
const router = require('./src/router');
const Socket = require('./src/socket');

// Open socket
const socket = new Socket(config.SOCKET_PORT);

socket.run();


const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.init(app);


const hostname = '127.0.0.1';

app.listen(config.SERVER_PORT, hostname, () => {
    console.lol('cyan', `Server running at http://${hostname}:${config.SERVER_PORT}/`);
});
//https://www.aplusclick.org/grade8.htm
