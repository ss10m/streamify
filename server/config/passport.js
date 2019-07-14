var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db');

passport.use(new Strategy(
	function(username, password, cb) {
		console.log('checking for user');
		db.users.findByUsername(username, function(err, user) {
		if (err) { return cb(err); }
		if (!user) { return cb(null, false); }
		if (user.password != password) { return cb(null, false); }
		return cb(null, user);
		});
	}));

passport.serializeUser(function(user, cb) {
	console.log("IN SERIALIZE");
	cb(null, user.id);
});
	
passport.deserializeUser(function(id, cb) {
	console.log("IN DESERIALIZE");
	db.users.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});