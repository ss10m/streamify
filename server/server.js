const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')

const app = express();
const port = 5000;

require('./db/mongoose.js');
require('./db/User.js');
require('./db/users.js');
require('./db/index.js');

require('./config/passport.js');

const twitchify = require('./twitchify.js');
const auth = require('./config/auth.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    console.log('============== new request ===============')
    console.log(req.url, res.user)
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
        res.redirect('/')
  })(req, res, next);
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
    //var auth = req.get('Authorization');
    //twitchify.followStreamer(req.user['username'], req.body['name']);
});

app.post('/api/unfollow', auth.required, (req, res, next) => {
    var auth = JSON.parse(req.get('Authorization'));
    console.log(auth.username + ' is trying to unfollow ' + req.body['name']);
    //var auth = req.get('Authorization');
    //twitchify.followStreamer(req.user['username'], req.body['name']);
});

app.listen(port, () => console.log(`Listening on port ${port}`));