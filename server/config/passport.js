var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new Strategy(
	function(username, password, cb) {
		User.findOne({ username })
		.then((user) => {
			if(!user || !user.validatePassword(password)) {
				console.log(user, password)
				console.log('email or password is invalid')
				return cb(null, false);
			}
			return cb(null, user);
		}).catch(cb);
	}
));

