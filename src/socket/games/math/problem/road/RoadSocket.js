const road = require('../../../../../controllers/games/math/problem/road');

class RoadSocket {

    constructor() {
        // Time of the game
        this.time = 0;

        // Socket's client
        this.client = null;

        this.game = {};

        // Instance of timer's setInterval
        this.timerInterval = null;
        this.mainEventName = 'games/math/problem/road';

        this._handleMainEvent = this._handleMainEvent.bind(this);
        this._handleAnswerEvent = this._handleAnswerEvent.bind(this);
        this._handleDecrimentTime = this._handleDecrimentTime.bind(this);
        this.turnOffTimer = this.turnOffTimer.bind(this);
    }

    init(client) {
        // Setting up client passed from socket connection
        this.client = client;

        // Define events
        this.client.on(this.mainEventName, this._handleMainEvent);
        this.client.on(`${this.mainEventName}:answer`, this._handleAnswerEvent);
        this.client.on(`${this.mainEventName}:exit`, this.turnOffTimer);
    }

    _handleMainEvent(args) {
        // Set language
        // Todo: find another way to set up global configs
        road.setLanguage(args.lng);

        // Set game's attributes
        this.setGame(args);

        // Emit game to client
        this._emitGame();

        // Run timer countdown by emitting with interval
        this.turnOnTimer();
    }

    setGame() {
        // Get new game's attributes
        this.game = road.getNewGame();

        // Set game's time
        // Todo: this should be stored in db
        this.time = 60;
    }

    _emitGame() {
        // Handle :game event
        this.client.emit(`${this.mainEventName}:game`, {
            problem: this.game.problem,
            type: this.game.type,
        });
    }

    turnOnTimer() {
        const oneSecond = 1000;

        // Stop timer in case if it's already started
        this.turnOffTimer();

        // Push initial time to the client
        this._emitTimer();

        // Decriment time every second and push to client
        this.timerInterval = setInterval(this._handleDecrimentTime, oneSecond);
    }

    _emitTimer() {
        // Handle :timer event
        this.client.emit(`${this.mainEventName}:timer`, this.time);
    }

    _handleDecrimentTime() {

        if(this.time === 0) {
            // When time expired stop the timer and push :expired event
            this.turnOffTimer();
            this._emitExpired();

        } else {
            this.time--;
            this._emitTimer();
        }
    }

    turnOffTimer() {
        // Stop timer
        clearInterval(this.timerInterval);
    }

    _emitExpired() {
        // Handle :expired event
        this.client.emit(`${this.mainEventName}:expired`, {message: 'Your time is up!'});
    }

    _handleAnswerEvent(args) {
        // The {args} is passed from client
        const answers = {
            findV: this.game.units.V,
            findS: this.game.units.S,
            findT: this.game.units.T,
        };
        const rightAnswer = answers[this.game.type];

        // Compare client's answer with right answer
        if(args.answer === rightAnswer) {
            this._handleSuccess();
        } else {
            this._handleError();
        }
    }

    _handleSuccess() {
        this.turnOffTimer();
        this._emitSuccess();
    }

    _handleError() {
        this.turnOffTimer();
        this._emitError();
    }

    _emitSuccess() {
        // Handle :success event
        this.client.emit(`${this.mainEventName}:success`, {message: 'Your answer is right!!!'});
    }

    _emitError() {
        // Handle :error event
        this.client.emit(`${this.mainEventName}:error`, {message: 'Your answer is wrong!!!'});
    }

}

module.exports = RoadSocket;
