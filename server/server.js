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
app.use(session({ secret: 'secsecsec', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


app.use((request, response, next) => {
    console.log('============== new request ===============')
    console.log(request.url, request.user)
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
        var cookie = request.get('Authorization');
        console.log(cookie)
        twitchify.getStreamers(JSON.parse(cookie).username, function(data) {
            response.json(data);
        });
});

app.get('/api/topStreamers', (request, response) => {
    response.json(twitchify.topStreamers);
});

app.get('/api/streamer/:name', (request, response) => {
    var name = request.params.name;
    twitchify.getStreamer(name, function(jsonStreamer) {
        response.json(jsonStreamer);
    });
});



app.post('/api/follow', (request, response) => {
    console.log('trying to follow' + request.body['name']);
    var cookie = request.get('Authorization');
    console.log(cookie)
    twitchify.followStreamer(request.user['username'], request.body['name']);});

app.listen(port, () => console.log(`Listening on port ${port}`));