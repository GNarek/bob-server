const jwt = require('jsonwebtoken');

const config = require('../../config/main');
const Users = require('../../models/Users');

class Auth {

    constructor() {
        this.user = null;
    }

    validateJwt(jwtToken) {

        let result;

        try {
            result = jwt.verify(jwtToken, config.JWT.secret);
        } catch(err) {
            result = false;
        }

        if(!result) {
            return false;
        }

        return true;
    }

    // returns user's object or false
    async findUserByJwt(jwtToken) {

        if(this.validateJwt(jwtToken)) {

            const result = jwt.verify(jwtToken, config.JWT.secret);
            const userId = result.id;
            const user = await Users.findById(userId, (data) => data, () => false);

            if(user) {
                this.user = user;
                return user;
            }

            if(!user) {
                this.user = null;
                return null;
            }
        }

        return false;
    }

}

module.exports = new Auth();
