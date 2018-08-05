const tr = require(`${global.SRC_DIR}translation`);
const Users = require(`${global.SRC_DIR}models/Users`);
const Db = require(`${global.SRC_DIR}db`);
const config = require(`${global.SRC_DIR}config/main`);
const jwt = require('jsonwebtoken');

class RegisterController {

    constructor() {

        // Default language
        this.language = 'en';

        this.postRun = this.postRun.bind(this);
    }

    setLanguage(language) {
        // Set language
        this.language = language;
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

        return re.test(email);
    }

    async validateUser(user) {
        // TODO: Translate errors
        const errors = [];

        if(!user.email) {
            errors.push({email: 'Email is required.'});
        } else if(!this.validateEmail(user.email)) {
            errors.push({email: 'Email is not valid.'});
        } else {
            const User = await Users.findOne({email: user.email});

            if (User !== null && typeof User === 'object') {
                errors.push({email: `User with ${user.email} already exist.`});
            }
        }

        if(!user.password) {
            errors.push({password: 'Password is required.'});
        }

        if(!user.firstName) {
            errors.push({firstName: 'First name is required.'});
        }

        if(!user.lastName) {
            errors.push({lastName: 'Last name is required.'});
        }

        return errors;

    }

    async postRun(POST) {

        const user = POST.user;

        // Checking if user's object exist in request.
        if(typeof user === 'object' && user !== null) {
            const errors = await this.validateUser(user);

            // if there are any errors return the errors.
            if(errors.length > 0) {
                return {
                    status: 'error',
                    error: {
                        errorCode: '422',
                        errors,
                    },
                };
            }

            return this.createUser(user);
        }

        return {
            status: 'error',
            error: {
                errorCode: '422',
                errorMessage: 'Required parameters missing.',
            },
        };
    }

    async createUser(user) {

        // New user object.
        const newUser = {

            _id: Db.Types.ObjectId(), // eslint-disable-line
            email: user.email,
            password: user.password,
            profile: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
            role: 'Admin',
        };

        const result = await Users.save(newUser);

        if(result.status && result.status === 'error') {
            return {
                status: 'error',
                error: {
                    errorCode: result.error.code,
                    error: result.error.message,
                },
                data: null,
            };
        }

        const id = result.data._id;
        const token = jwt.sign({id}, config.JWT.secret, {});

        return {
            status: 'success',
            error: null,
            data: {
                user: {
                    profile: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                    role: 'Admin',
                    email: user.email,
                },
                jwt: token,
            },
        };
    }
}

module.exports = new RegisterController();
