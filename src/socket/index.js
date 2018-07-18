const io = require('socket.io')();
const RoadSocket = require('./games/math/problem/road');

class Socket {

    constructor(port) {
        this.port = port;

        this._handleEvents = this._handleEvents.bind(this);
    }

    run() {
        // On connection handle events
        io.on('connection', this._handleEvents);

        // Starting listen to the port
        io.listen(this.port);
        console.log('Socket listening on port ', this.port);
    }

    _handleEvents(client) {
        // Initialize new road socket
        const roadSocket = new RoadSocket;
        roadSocket.init(client);
    }

}

module.exports = Socket;
