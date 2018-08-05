const tr = require(`${global.SRC_DIR}translation`);
const helpers = require(`${global.SRC_DIR}helpers`);

const getRand = helpers.getRand;

class Road {

    constructor() {
        // Road length
        this.S = 0;

        // Speed
        this.V = 0;

        // Time
        this.T = 0;

        // Set up problem types
        this.types = [
            'findV',
            'findS',
            'findT',
        ];
        this.type = this.types[0];

        // Default language
        this.language = 'en';

        // Rules
        this.rules = [
            function(req) {
                return this.validateJwt(req.headers.jwt); // eslint-disable-line
            },
        ];
    }

    setLanguage(language) {
        // Set language
        this.language = language;
    }

    actionRun() {
        // Generate new game
        return this.getNewGame();
    }

    generateNewGame() {
        // Generate units
        this.generateRandomUnits();

        // Generate type
        this.generateRandomType();
    }

    generateRandomUnits() {
        // Generate new random units
        this.T = getRand(2, 9);
        this.V = getRand(20, 120);
        this.S = this.V * this.T;
    }

    generateRandomType() {
        // Randomly get one of problem types
        this.type = this.types[getRand(0, 2)];
    }

    getNewGame() {
        // Generate nwe game's units and type
        this.generateNewGame();

        const units = {S: this.S, V: this.V, T: this.T};
        const type = this.type;
        const problem = tr.t(`road.${type}`, units, this.language);

        return {
            problem,
            type,
            units,
        };
    }
}

module.exports = new Road();
