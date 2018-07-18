const tr = require('../../../../../src/translation');
const helpers = require('../../../../../src/helpers');

const getRand = helpers.getRand;

class Road {

    constructor() {
        this.S = 0; // Road length
        this.V = 0; // Speed
        this.T = 0; // Time

        // Set up problem types
        this.types = [
            'find_v',
            'find_s',
            'find_t',
        ];
        this.type;

        // Default language
        this.language = 'en';
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

module.exports = new Road;
