const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UsersGamesScheme = schema({
    _id: schema.Types.ObjectId,
    start: {
        type: Date, default: Date.now,
    },
    end: {
        type: Date,
    },
    problem: {
        type: String,
    },
    time: {
        type: Number,
    },
    solvedTime: {
        type: Number,
    },
    solved: {
        type: String,
        enum: ['0', '1'],
        default: '0',
    },
    rightAnswer: {
        type: 'String',
    },
    userAnswer: {
        type: 'String',
    },
    gamePoints: {
        type: Number,
    },
    mathPoints: {
        type: Number,
    },
    user: {type: schema.Types.ObjectId, ref: 'Users'},
});

module.exports = UsersGamesScheme;
