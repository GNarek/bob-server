const auth = require('../../../modules/Auth');
const UsersGames = require('../../../models/UsersGames');

class GamesHistory {

    constructor() {
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

    async getGames() {

        if(auth.user) {

            const games = await UsersGames.Model.find({user: auth.user._id}, null, {sort: {start: -1}});

            if(games && games.length) {
                return games;
            }

            return null;
        }

        return null;
    }

    async actionRun() {

        const games = await this.getGames();

        if(games) {
            return games;
        }

        if(!games) {
            return null;
        }

        return null;
    }
}

module.exports = new GamesHistory();
