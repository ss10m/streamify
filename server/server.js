const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 5000;
var passport = require('passport');

require('./db/mongoose.js');
require('./db/User.js');
require('./db/users.js');
require('./db/index.js');

require('./config/passport.js');


var twitchify = require('./twitchify.js');
var ensureLoggedIn = require('connect-ensure-login')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'secsecsec', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());



	
app.use((request, response, next) => {
	console.log('============== new request ===============')
	console.log(request.url, request.user)
	next()
})

app.get('/api/streamers', 
	ensureLoggedIn.ensureLoggedIn('/login'),
	(request, response) => {
		twitchify.getStreamers(request.user['username'], function(data) {
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
	ensureLoggedIn.ensureLoggedIn('/add'),
	function(req, res){
		console.log('logout');
		req.logout();
		res.redirect('/');
});

app.post('/api/follow', (request, response) => {
	twitchify.followStreamer(request.user['username'], request.body['name']);
	response.redirect('/streamers');
});

var streamers = twitchify.streamers;


app.listen(port, () => console.log(`Listening on port ${port}`));