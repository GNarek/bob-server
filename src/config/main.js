const chalk = require('chalk');

// Add chalk to console
// Usage console.lol('red', "I'm red");
console.lol = (color, ...args) => {
    console.log(chalk[color](args)); // eslint-disable-line
};

const config = {
    SERVER_PORT: process.env.SERVER_PORT || 5010,
    SOCKET_PORT: process.env.SOCKET_PORT || 5011,
    SRC_DIR: `${process.cwd()}/src/`,
    DB: {
        url: 'mongodb://localhost:27017/test',
    },
    JWT: {
        'secret': 'hgyt657cbvcfdxerzqwmokmp9u87y675r45e3scv',
    },
};

// Define global project dir
global.SRC_DIR = config.SRC_DIR;

module.exports = config;
