const road = require('../../../../../controllers/games/math/problem/road');
const auth = require('../../../../../modules/Auth');
const UsersGames = require('../../../../../models/UsersGames');

const DB = require(`${global.SRC_DIR}db`);

class RoadSocket {

    constructor() {
        // Time of the game
        this.time = 0;

        // Socket's client
        this.client = null;

        this.game = {
            isset: false,
        };
        this.usersGame = false;

        // Instance of timer's setInterval
        this.timerInterval = null;
        this.mainEventName = 'games/math/problem/road';

        this._handleMainEvent = this._handleMainEvent.bind(this);
        this._handleAnswerEvent = this._handleAnswerEvent.bind(this);
        this._handleDecrimentTime = this._handleDecrimentTime.bind(this);
        this.turnOffTimer = this.turnOffTimer.bind(this);
        this.authorized = this.authorized.bind(this);
    }

    init(client) {
        // Setting up client passed from socket connection
        this.client = client;

        // Define events
        this.client.on(this.mainEventName, this.authorized.bind(null, this._handleMainEvent));
        this.client.on(`${this.mainEventName}:answer`, this.authorized.bind(null, this._handleAnswerEvent));
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
        this.game.isset = true;

        // Set game's time
        // Todo: this should be stored in db
        this.time = 60;
        this.storeNewGame();
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

    async _handleAnswerEvent(args) {
        // The {args} is passed from client

        if(this.game.isset) {
            const answers = {
                findV: this.game.units.V,
                findS: this.game.units.S,
                findT: this.game.units.T,
            };
            const rightAnswer = answers[this.game.type];

            const solved = args.answer === rightAnswer;

            // Compare client's answer with right answer
            if(solved) {
                this._handleSuccess();
            } else {
                this._handleError();
            }

            if(this.usersGame !== null && typeof this.usersGame === 'object' && this.usersGame.solved !== '1') {
                this.usersGame.solved = solved ? '1' : '0';
                this.usersGame.userAnswer = args.answer;
                this.usersGame.end = Date.now();
                this.usersGame.gamePoints = solved ? 5 + this.time : 0;
                this.usersGame.mathPoints = solved ? 3 : 0;
                this.usersGame.solvedTime = this.usersGame.time - this.time;

                this.usersGame.save((err) => {
                    if (err) {
                        console.lol('red', err);
                        this.usersGame = false;
                    } else {
                        this.usersGame = false;
                    }
                });
            }

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

    _handleUnauthorizedRequest() {
        // Handle :unauthorized event
        this.client.emit(`${this.mainEventName}:unauthorized`, {message: 'Your are not authorized'});
    }

    async authorized(cb, args) {
        if(this.validateArgs(args)) {

            const {headers: {jwt}, data} = args;
            const user = await auth.findUserByJwt(jwt);

            if(user !== null && typeof user === 'object') {
                cb(data);
            } else {
                this._handleUnauthorizedRequest();
            }
        } else {
            this._handleUnauthorizedRequest();
        }
    }

    validateArgs(args) {
        if(args !== null && typeof args === 'object' && args.headers !== null && typeof args.headers === 'object' && args.data !== null && typeof args.data === 'object') {
            return true;
        }
        return false;
    }

    async storeNewGame() {

        const answers = {
            findV: this.game.units.V,
            findS: this.game.units.S,
            findT: this.game.units.T,
        };
        const rightAnswer = answers[this.game.type];


        const result = await UsersGames.save({
            _id: DB.Types.ObjectId(), // eslint-disable-line
            problem: this.game.problem,
            time: this.time,
            rightAnswer,
            gamePoints: 0,
            mathPoints: 0,
            user: auth.user._id,
        });

        if(result.status === 'success') {
            this.usersGame = result.data;

            auth.user.usersGames.push(this.usersGame._id);
            auth.user.save();
        }
    }

}

module.exports = RoadSocket;
