const Users = require(`${global.SRC_DIR}models/Users`);
const config = require(`${global.SRC_DIR}config/main`);
const jwt = require('jsonwebtoken');

class LoginController {

    constructor() {

        // Default language
        this.language = 'en';

        this.postRun = this.postRun.bind(this);
    }

    setLanguage(language) {
        // Set language
        this.language = language;
    }

    async postRun(POST) {

        const postUser = POST.user;

        // Checking if user's object exist in request.
        if(typeof postUser === 'object' && postUser !== null) {
            const {email, password} = postUser;
            const result = await Users.validateLogin(email, password);

            if(result.status === 'success') {

                const {profile, role, _id} = result.data.user;

                const jwtToken = jwt.sign({id: _id}, config.JWT.secret);

                return {
                    status: 'success',
                    error: null,
                    data: {
                        user: {profile, role, email},
                        jwt: jwtToken,
                    },
                };
            }

            return {
                status: 'error',
                error: result.error,
                data: null,
            };
        }

        return {
            status: 'error',
            error: {
                errorCode: '422',
                errorMessage: 'Required parameters missing.',

                POST,
            },
        };
    }
}

module.exports = new LoginController();
