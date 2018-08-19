const auth = require('../../../modules/Auth');
const Users = require('../../../models/Users');

class Rating {

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

    async getUsersWithGames() {

        if(auth.user) {

            const users = await Users.Model.find().populate('usersGames');

            if(users && users.length) {
                return users;
            }

            return null;
        }

        return null;
    }

    async actionRun() {

        const users = await this.getUsersWithGames();

        const filteredUsers = [];

        if(users) {

            for(const user of users) {

                let gamePoints = 0;
                let mathPoints = 0;
                let solvedCount = 0;
                let solvedTimes = 0;
                let solvedPercent = 0;
                let middleGamePoints = 0;
                let middleMathPoints = 0;
                let middleAnswersTime = 0;

                const points = {};

                for(const game of user.usersGames) {
                    gamePoints += game.gamePoints;
                    mathPoints += game.mathPoints;

                    if(game.solved === '1') {
                        solvedCount++;
                        solvedTimes += game.solvedTime > 0 ? game.solvedTime : 0;
                    }
                }

                const gamesCount = user.usersGames.length;

                solvedPercent = gamesCount > 0 ? 100 / gamesCount * solvedCount : 0;
                middleAnswersTime = solvedCount > 0 ? solvedTimes / solvedCount : 0;
                middleGamePoints = solvedCount > 0 ? gamePoints / solvedCount : 0;
                middleMathPoints = solvedCount > 0 ? mathPoints / solvedCount : 0;

                points.gamesCount = gamesCount;
                points.gamePoints = gamePoints;
                points.mathPoints = mathPoints;
                points.solvedCount = solvedCount;
                points.solvedPercent = solvedPercent;
                points.middleAnswersTime = middleAnswersTime;
                points.middleGamePoints = middleGamePoints;
                points.middleMathPoints = middleMathPoints;

                const filteredUser = {
                    _id: user._id,
                    email: user.email,
                    profile: user.profile,
                    points,
                };

                filteredUsers.push(filteredUser);

            }

            return filteredUsers;
        }

        if(!users) {
            return null;
        }

        return null;
    }
}

module.exports = new Rating();
