const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
const mongoose = require('mongoose');

const app = express();
const port = 5000;

require('./db_models/User.js');
require('./db_models/users.js');

require('./config/passport.js');

const twitchify = require('./twitchify.js');
const auth = require('./config/auth.js')

mongoose.connect('mongodb://localhost:27017/twitchify',  { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    console.log('============== new request ===============')
    console.log(req.url)
    next()
})


// User Authentication

app.post('/login', auth.optional, (req, res, next) => {
    console.log(req.body)
    return passport.authenticate('local', { session: false }, (err, verifiedUser, info) => {
        if(err) {
            console.log(err)
        }

        if(verifiedUser) {
            const user = verifiedUser;
            user.token = verifiedUser.generateJWT();
            console.log('authenticated')
            return res.json({ user: user.toAuthJSON() });
        }

        console.log('failed to authenticate')
        return res.status(422).json({
            errors: {
                user: 'failed to authenticate',
            },
        });
  })(req, res, next);
});

app.post('/register', auth.optional, (req, res, next) => {
    console.log(req.body)
    return res.status(422).json({
        errors: {
            user: 'failed to authenticate',
        },
    });
});

app.post('/logout', auth.optional, (req, res, next) => {
        console.log('logout');
        req.logout();
        res.redirect('/');
    }
);


// Twitchify API

app.get('/api/streamers', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    twitchify.getStreamers(auth.username, function(data) {
        res.json(data);
    });
});

app.get('/api/topStreamers', (req, res) => {
    res.json(twitchify.topStreamers);
});

app.get('/api/streamer/:name', (req, res) => {
    var auth = JSON.parse(req.get('Authorization'));
    var name = req.params.name;
    twitchify.getStreamer(auth, name, function(retStreamer) {
        res.json(retStreamer);
    });
});

app.post('/api/follow', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to follow ' + req.body['name']);
    twitchify.followStreamer(auth.username, req.body['name']);
});

app.post('/api/unfollow', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to unfollow ' + req.body['name']);
    twitchify.unfollowStreamer(auth.username, req.body['name']);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

console.log('============ server  started =============')



//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"