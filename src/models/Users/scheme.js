const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema;

const UserScheme = schema({
    _id: schema.Types.ObjectId,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profile: {
        firstName: {type: String},
        lastName: {type: String},
    },
    role: {
        type: String,
        enum: ['Member', 'Client', 'Owner', 'Admin'],
        default: 'Member',
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    usersGames: [{type: schema.Types.ObjectId, ref: 'UsersGames'}],
});

UserScheme.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

const setPasswordHash = function(value) {
    this.passwordHash = bcrypt.hashSync(value, 12); // eslint-disable-line
};

UserScheme.virtual('password').set(setPasswordHash);

module.exports = UserScheme;
