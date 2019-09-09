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
const User = mongoose.model('User');

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

    return passport.authenticate('local', { session: false }, (err, verifiedUser) => {
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
            error: 'Incorrect username or password!',
        });
  })(req, res, next);
});

app.post('/register', auth.optional, (req, res, next) => {
    const user = req.body;

    if(!user.username) {
        return res.status(422).json({
            error: 'Username is required!',
        });
    }
    
    if(!user.password) {
        return res.status(422).json({
            error: 'Password is required!',
        });
    }

    checkIfUsernameExists(user, (err, user) => {
        console.log(err, user)
        if(err) {
            return res.status(422).json({
                error: err
            });
        }

        const newUser = new User(user);
        newUser.setPassword(user.password)
        newUser.save(function(err, createdUser) {
            if(err) {
                return res.status(422).json({
                    error: 'Error while registering user!',
                });
            }
            
            const retUser = createdUser;
            retUser.token = retUser.generateJWT();
            console.log('registered')
            return res.json({ user: retUser.toAuthJSON() });

         });
    });
});


function checkIfUsernameExists(user, callback) {
    var username = user.username;
    User.findOne({ username })
        .then((userFound) => {
            if(!userFound) {
                callback(false, user);
            } else {
                callback('Username is taken!', user);
            }
        });
}

app.post('/logout', auth.optional, (req, res, next) => {
        console.log('logout');
        req.logout();
        res.redirect('/');
    }
);


// Twitchify API

app.get('/api/streamers', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    twitchify.getUser("getStreamers", auth.username, function(data) {
        res.json(data);
    });
});

app.get('/api/topStreamers', (req, res) => {
    res.json(twitchify.topStreamers);
});

app.get('/api/streamer/:name', (req, res) => {
    var auth = JSON.parse(req.get('Authorization'));
    var name = req.params.name;
    twitchify.getStreamer(auth, name, function(data) {
        res.json(data);
    });
});

app.post('/api/follow', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to follow ' + req.body['name']);
    twitchify.followStreamer(auth.username, req.body['name'], function(data) {
        res.json(data);
    });
});

app.post('/api/unfollow', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to unfollow ' + req.body['name']);
    twitchify.unfollowStreamer(auth.username, req.body['name'], function(data) {
        res.json(data);
    });
});

app.post('/api/followGame', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to follow ' + req.body['gameName']  + " for " + req.body['name'] );
    var args = {"gameName": req.body['gameName'],
                "streamerName": req.body['name'],
                "callType": 'follow'}
    twitchify.getUser("followGame", auth.username, function(data) {
        res.json(data);
    }, args);
});

app.post('/api/unfollowGame', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to unfollow ' + req.body['gameName']  + " for " + req.body['name'] );
    var args = {"gameName": req.body['gameName'],
                "streamerName": req.body['name'],
                "callType": 'unfollow'}
    twitchify.getUser("unfollowGame", auth.username, function(data) {
        res.json(data);
    }, args);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

console.log('============ server  started =============')



//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"