const Users = require('./src/models/Users');
const UsersGames = require('./src/models/UsersGames');
const Db = require('./src/db');

/* Mail test [start] */
if(false) { //eslint-disable-line
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'poyopipop@gmail.com',
            pass: 'Narek-12',
        },
    });

    const mailOptions = {
        from: 'poyopipop@gmail.com',
        to: 'dimakohakolov@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}
/* Mail test [end] */

Users.findOne({email: 'poyopipop@gmail.com'}, (user) => {
    // UsersGames.save({
    //     _id: Db.Types.ObjectId(),
    //     start: Date().now,
    //     end: Date().now,
    //     problem: 'Car crooseed out .... Find speed.',
    //     time: 60,
    //     solvedTime: 24,
    //     rightAnswer: 7,
    //     userAnswer: 12,
    //     gamePoints: 3,
    //     mathPoints: 1,
    //     user: user._id,
    // }, (UsersGame) => {
    //     console.log('UsersGame saved. _id:', UsersGame._id);
    // });
// user.usersGames.push('5b57958da2be1a94c6672389');

// user.save((error, savedBlog) => {
//         if (error) {
//             console.log('error', error);
//         } else{
//             console.log('savedBlog', savedBlog);
//         }
//     });

    // console.log('---user---', user);
    // console.log('user._id', user._id);
});
// UsersGames.find({}, (game) => {
//     console.log('---game---', game);
// });
/* Db tests [end] */
