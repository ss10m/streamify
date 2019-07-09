const express = require('express');
const bodyParser = require('body-parser');
var twitchify = require('./twitchify.js');
const app = express();
const port = 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((request, response, next) => {
	console.log('============== new request ===============')
	console.log(request.url)
	next()
})

app.get('/api/streamers', (request, response) => {
	twitchify.getStreamers(
		function(data) {
			console.log(data);
			response.json(data);
		}
	);
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
		express: 'Hello From Express!'
	});
});

app.post('/api/world', (request, response) => {
	console.log(request.body['post']);
	twitchify.followStreamer(request.body['post']);
	response.send(
		`I received your POST request. This is what you sent me: ${request.body.post}`,
	);
});

app.post('/api/login', (request, response) => {
	console.log(request.body['email']);
	console.log(request.body['password']);
	response.send(
		`I received your POST request. This is what you sent me: ${request.body.post}`,
	);
});

app.post('/api/follow', (request, response) => {
	twitchify.followStreamer(request.body['name']);
	response.redirect('/');
});

var streamers = twitchify.streamers;


app.listen(port, () => console.log(`Listening on port ${port}`));