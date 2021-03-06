const fs = require('fs');

const auth = require('../modules/Auth');

const acceptedLanguages = ['en', 'ru', 'hy'];

class Router {

    init(app) {

        this.app = app;
        this.req = {};
        this.res = {};
        this.language = 'en';

        // Allow Cross-Origin Requests.
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            next();
        });

        // Init post requests
        this.initPostRequests();

        // Init get requests
        this.initGetRequests();
    }

    async validateJwt(jwtToken) {

        const user = await auth.findUserByJwt(jwtToken);

        // console.log('user [3]', user);

        if(user !== null && typeof user === 'object') {
            return true;
        }

        return false;
    }

    redirect(url) {
        this.res.redirect(`/${this.language}/${url}`);
        this.res.end();
    }

    async validateController(Controller) {

        if(Array.isArray(Controller.rules)) {

            const results = [];

            for(const rule of Controller.rules) {
                const validation = rule.bind(this);

                const validationResult = await validation(this.req); // eslint-disable-line

                if(validationResult) {
                    results.push(true);
                }

                if(!validationResult) {
                    results.push(true);
                }
            }

            const isValid = results.every((result) => result);

            return isValid;
        }

        return true;
    }

    initGetRequests() {
        // Get all requests.
        this.app.get('*', async(req, res, next) => {

            // Set req and res
            this.req = req;
            this.res = res;

            // All responses should be JSON type.
            res.setHeader('Content-Type', 'application/json');

            // Get requested url.
            const url = req.params[0];

            // Grab from url {language, directory, urlRestString, filePath}.
            const parsedUrl = this.parseUrl(url);

            // If url don't include language add default language in url.
            if(!acceptedLanguages.includes(parsedUrl.language)) {

                // Get browser's default language.
                const browserLanguage = req.acceptsLanguages(...acceptedLanguages);

                // Set default language blowser's default or EN.
                const defaultLanguage = browserLanguage || 'en';

                if(parsedUrl.language) {
                    return res.redirect(`/${defaultLanguage}/${parsedUrl.language}/${parsedUrl.urlRestString}`);
                }

                return res.redirect(`/${defaultLanguage}/${parsedUrl.urlRestString}`);
            }

            // If page is not specified take to HOME page.
            if(parsedUrl.directory === '') {
                return res.redirect(`/${parsedUrl.language}/home`);
            }


            const fileExist = fs.existsSync(parsedUrl.filePath);
            let data = {};

            // Check if index.js file exist by requested url.
            if(fileExist) {

                const Controller = require(parsedUrl.filePath);

                // If the index.js is allowed controller with actionRun method/action.
                if(Controller !== null && typeof Controller === 'object' && typeof Controller.actionRun === 'function') {

                    const isControllerValid = await this.validateController(Controller);

                    if(!isControllerValid) {
                        this.redirect('login');
                        return next();
                    }

                    if(isControllerValid === true) {

                        if(typeof Controller.setLanguage === 'function') {
                            Controller.setLanguage(parsedUrl.language);
                        }

                        const result = await Controller.actionRun();

                        if(result && result.length) {

                            data = {
                                status: 'success',
                                error: null,
                                data: result,
                            };

                            res.send(JSON.stringify(data));
                            res.end();
                            return next();
                        }

                        if(!result) {
                            data = {
                                status: 'success',
                                error: null,
                                data: null,
                            };

                            res.send(JSON.stringify(data));
                            res.end();
                            return next();
                        }
                    }

                } else {

                    // The index.js file exist but it's not a callable controller.
                    data = {
                        status: 'error',
                        error: {
                            errorCode: '404',
                            errorMessage: 'Action not found.',
                        },
                        data: null,
                    };
                }

            } else {

                // There is no index.js file with requested url.
                data = {
                    status: 'error',
                    error: {
                        errorCode: '404',
                        errorMessage: 'Page not found.',
                    },
                    data: null,
                };

            }

            res.send(JSON.stringify(data));
            res.end();
            return next();
        });
    }

    initPostRequests() {
        this.app.post('*', async(req, res, next) => {

            this.req = req;
            this.res = res;

            // All responses should be JSON type.
            res.setHeader('Content-Type', 'application/json');

            const url = req.params[0];

            // Grab from url {language, directory, urlRestString, filePath}.
            const parsedUrl = this.parseUrl(url);


            // If url don't include language choose default language.
            if(!acceptedLanguages.includes(parsedUrl.language)) {

                // Get browser's default language.
                const browserLanguage = req.acceptsLanguages(...acceptedLanguages);

                // Set default language blowser's default or EN.
                const defaultLanguage = browserLanguage || 'en';

                parsedUrl.language = defaultLanguage;
            }

            const fileExist = fs.existsSync(parsedUrl.filePath);
            let data = {};

            // Check if index.js file exist by requested url.
            if(fileExist) {

                const Controller = require(parsedUrl.filePath);

                // If the index.js is allowed controller with postRun method/action.
                if(Controller && typeof Controller.postRun === 'function') {

                    if(typeof Controller.setLanguage === 'function') {
                        Controller.setLanguage(parsedUrl.language);
                    }

                    const postParams = req.body;
                    const getParams = req.query;
                    const result = await Controller.postRun(postParams, getParams);

                    if(result && typeof result.status === 'string') {

                        data = {
                            status: result.status,
                            error: result.error,
                            data: result.data,
                        };

                    } else {
                        data = {
                            status: 'error',
                            error: {
                                errorCode: 130,
                                errorMessage: typeof result === 'object' && result !== null ? JSON.stringify(result) : result,
                            },
                            data: null,
                        };
                    }


                } else {

                    // The index.js file exist but it's not a callable controller.
                    data = {
                        status: 'error',
                        error: {
                            errorCode: '404',
                            errorMessage: 'Action not found.',
                        },
                        data: null,
                    };
                }

            } else {

                // There is no index.js file with requested url.
                data = {
                    status: 'error',
                    error: {
                        errorCode: '404',
                        errorMessage: 'Page not found.',
                    },
                    data: null,
                };

            }

            res.send(JSON.stringify(data));
            res.end();
            return next();
        });
    }

    parseUrl(url = '') {

        // Convert url into array.
        const urlParams = url.split('/');

        // Take first parameter from url and set it as language.
        const language = urlParams[1] || '';

        this.language = language;

        // Take rest part of url after language.
        const urlRestParams = urlParams.slice(2);
        const urlRestString = urlRestParams.join('/');

        // I don't remember why I wrote this regexp :(
        const directory = urlRestString.replace(/\/+$/, '') || '';

        // Create absolute path to index.js file by requested url.
        const filePath = `${global.SRC_DIR}controllers/${directory}/index.js`;

        return {
            language,
            directory,
            filePath,
            urlRestString,
        };
    }
}

const router = new Router();

module.exports = router;
