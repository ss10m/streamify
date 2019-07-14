const express = require('express');
const bodyParser = require('body-parser');

var twitchify = require('./twitchify.js');
const app = express();
const port = 5000;
var passport = require('passport');
require('./config/passport.js');

var ensureLoggedIn = require('connect-ensure-login')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());



	
app.use((request, response, next) => {
	console.log('============== new request ===============')
	console.log(request.url)
	console.log(request.user);
	next()
})

app.get('/api/streamers', 
	ensureLoggedIn.ensureLoggedIn('/login'),
	(request, response) => {
		console.log(request.user['username']);
		twitchify.getStreamers(function(data) {
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

app.post('/api/world', (request, response) => {
	console.log(request.body['post']);
	twitchify.followStreamer(request.body['post']);
	response.send(
		`I received your POST request. This is what you sent me: ${request.body.post}`,
	);
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/streamers');
});

app.post('/logout',
  function(req, res){
	console.log('logout');
    req.logout();
    res.redirect('/add');
});

app.post('/api/follow', (request, response) => {
	twitchify.followStreamer(request.body['name']);
	response.redirect('/streamers');
});

var streamers = twitchify.streamers;


app.listen(port, () => console.log(`Listening on port ${port}`));