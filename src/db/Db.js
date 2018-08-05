const mongoose = require('mongoose');

const config = require(`${global.SRC_DIR}config/main`);


mongoose.connect(config.DB.url, {useNewUrlParser: true})
    .then(() => {
        // mongoose.connection.db.dropDatabase();
        console.lol('cyan', 'DB connected:', config.DB.url);
    })
    .catch((error) => {
        console.lol('red', 'DB error [connect]', error);
    });

module.exports = mongoose;
