var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
/*
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


passport.use(new Strategy(
	function(username, password, done) {
	  User.findOne({ username: username }, function (err, user) {
		  console.log(user)
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.validatePassword(password)) { console.log('found user');return done(null, false); }
		return done(null, user);
	  });
	}
  ));
*/
  passport.use(new Strategy(
	  function(username, password, cb) {
		  console.log('in passport')
		User.findOne({ username })
		.then((user) => {
			if(!user || !user.validatePassword(password)) {
				console.log(user, password)
				console.log('email or password is invalid')
			return cb(null, false, { errors: { 'email or password': 'is invalid' } });
			}
	
			return cb(null, user);
		}).catch(cb);
  }));

