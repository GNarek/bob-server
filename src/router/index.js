const fs = require('fs');

const acceptedLanguages = ['en', 'ru', 'hy'];

class Router {

    init(app) {

        // Allow Cross-Origin Requests.
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        // Get all requests.
        app.get('*', (req, res, next) => {

            // All responses should be JSON type.
            res.setHeader('Content-Type', 'application/json');

            // Get requested url.
            const url = req.params[0];

            // Convert url into array.
            const urlParams = url.split('/');

            // Take first parameter from url and set it as language.
            const lng = urlParams[1] || '';

            // Take rest part of url after language.
            const urlRestParams = urlParams.slice(2);
            const urlRestString = urlRestParams.join('/');

            // I don't remember why I wrote this regexp :(
            const directory = urlRestString.replace(/\/+$/,'') || '';

            // Create absolute path to index.js file by requested url.
            const projectPath = process.cwd();
            const filePath = projectPath + '/src/' + directory + '/index.js';

            // If url don't include language add default language in url
            if(!acceptedLanguages.includes(lng)) {

                // Get browser's default language.
                const browserLanguage = req.acceptsLanguages(...acceptedLanguages);

                // Set default language blowser's default or EN.
                const language = browserLanguage || 'en';

                if(lng) {
                    return res.redirect(`/${language}/${lng}/${urlRestString}`);
                }

                return res.redirect(`/${language}/${urlRestString}`);
            }

            // If page is not specified take to HOME page
            if(directory === '') {
                return res.redirect(`/${lng}/home`);
            }


            const fileExist = fs.existsSync(filePath);
            let data = {};

            // Check if index.js file exist by requested url.
            if(fileExist) {

                const Controller = require(filePath);

                // If the index.js is allowed controller with actionRun method/action.
                if(Controller !== null && typeof Controller === 'object' && typeof Controller.actionRun === 'function') {

                    if(typeof Controller.setLanguage === 'function') {
                        Controller.setLanguage(lng);
                    }

                    data = {
                        status: 'success',
                        error: null,
                        data: Controller.actionRun(),
                    };

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
        });
    }
}

const router = new Router;

module.exports = router;
