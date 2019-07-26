const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 5000;
var passport = require('passport');
var session = require('express-session')

require('./db/mongoose.js');
require('./db/User.js');
require('./db/users.js');
require('./db/index.js');

require('./config/passport.js');



var twitchify = require('./twitchify.js');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secsecsec', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

//app.use(require('./routes'));
	


var streamers = twitchify.streamers;

const auth = require('./config/auth.js')

//app.use('/users', require('./routes/index.js'));
/*
app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log('1')
    res.redirect('/');
  });
*/
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


  app.use((request, response, next) => {
    console.log('============== new request ===============')
    console.log(request.url, request.user)
    next()
  })
  
  app.get('/api/streamers', 
    (request, response) => {
      var cookie = request.get('Authorization');
      twitchify.getStreamers(JSON.parse(cookie).username, function(data) {
        response.json(data);
    });
  });
  
  app.get('/api/topStreamers', (request, response) => {
    response.json(twitchify.topStreamers);
  });
  
  app.get('/api/streamerExact/:name', (request, response) => {
    var name = request.params.name;
    response.send(streamers[name]);
  });
  
  app.get('/api/streamer/:name', (request, response) => {
    var name = request.params.name;
    twitchify.getStreamer(name, function(jsonStreamer) {
      response.json(jsonStreamer);
    });
    
  });
  
  app.get('/api/hello', (request, response) => {
    response.send({
      express: 'Logged in'
    });
  });
  
  app.get('/api/token', (request, response) => {
    console.log("GETTING TOKEN")
    var user = {};
    if(request.user) {
      user['username'] = request.user['username'];
    } else {
      user['username'] = ''
    }
    response.send({
      loggedIn: user
    });
  });
  
  app.post('/api/world', (request, response) => {
    twitchify.followStreamer(request.body['post']);
    response.send(
      `I received your POST request. This is what you sent me: ${request.body.post}`,
    );
  });
  
  
  app.post('/logout',
    function(req, res){
      console.log('logout');
      req.logout();
      res.redirect('/');
  });
  
  app.post('/api/follow', (request, response) => {
    twitchify.followStreamer(request.user['username'], request.body['name']);
    response.redirect('/streamers');
  });

app.listen(port, () => console.log(`Listening on port ${port}`));