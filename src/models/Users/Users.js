const MainModel = require(`${global.SRC_DIR}models/Main`);
const UserScheme = require(`${global.SRC_DIR}models/Users/scheme`);

class Users extends MainModel {

    constructor() {
        const tableName = 'Users';

        super(tableName, UserScheme);
        this.tableName = tableName;
    }

    async validateLogin(email, password) {
        const user = await this.findOne({email});

        if (!user || !user.validPassword(password)) {

            return {
                status: 'error',
                error: {
                    errorCode: '',
                    errorMessage: 'Invalid username/password',
                },
                data: null,
            };
        }

        return {
            status: 'success',
            error: null,
            data: {user},
        };
    }

}

module.exports = new Users();
