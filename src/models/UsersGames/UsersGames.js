const MainModel = require(`${global.SRC_DIR}models/Main`);
const UsersGamesScheme = require(`${global.SRC_DIR}models/UsersGames/scheme`);

class UsersGames extends MainModel {

    constructor() {
        const tableName = 'UsersGames';

        super(tableName, UsersGamesScheme);
        this.tableName = tableName;
    }
}

module.exports = new UsersGames();
