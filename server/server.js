const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
const mongoose = require('mongoose');


require('./db_models/User.js');

require('./config/passport.js');

const twitchify = require('./twitchify.js');
const auth = require('./config/auth.js')
const User = mongoose.model('User');

mongoose.connect('mongodb://localhost:27017/twitchify',  { useNewUrlParser: true });


const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

server.listen(port, () => console.log(`Listening on port ${port}`));

var onlineUsers = {};
var socketIdToSocket = {};

twitchify.setNotificationVariables(onlineUsers, socketIdToSocket);


var socketioJwt   = require("socketio-jwt");
io.use(socketioJwt.authorize({
    secret: 'secret',
    handshake: true
}));

io.on('connection', socket => {
    console.log('connected! ', socket.decoded_token);

    twitchify.verifyUserToken(socket.decoded_token, () => {
        console.log('('+ socket.id + ') ' + socket.decoded_token.username + 'connected');
    
        addToOnlineUsers(socket);
    
        
        socket.on('disconnect', () => {
            console.log('('+ socket.id + ') client disconnected')
            removeFromOnlineUsers(socket.id, socket.decoded_token.username);
        });
    })
    

    
    
})


function addToOnlineUsers(socket) {
    var username = socket.decoded_token.username;
    socketIdToSocket[socket.id] = socket;
    if(username in onlineUsers) {
        var current = onlineUsers[username];
        current.push(socket.id)
        onlineUsers[username] = current;
    } else {
        onlineUsers[username] = [socket.id]
    }
    console.log(onlineUsers)
}

function removeFromOnlineUsers(socketId, username) {
    var current = onlineUsers[username]
    onlineUsers[username] = current.splice(current.indexOf(socketId), 1);
    if(current.length > 0) {
        onlineUsers[username] = current;
    } else {
        delete onlineUsers[username];
    }
    delete socketIdToSocket[socketId];

    console.log(onlineUsers)
}

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
    console.log(req.user)
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

app.get('/search/:category/:query', auth.optional, (req, res) => {
    var category = req.params.category;
    var query = req.params.query;
    twitchify.search(category, query, function(data) {
        res.json(data);
    });
});



console.log('============ server  started =============')

//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"