console.log('users')
const mongoose = require('mongoose');

var records = [
    { id: 1, username: 'admin', password: 'password', displayName: 'ADMIN', emails: [ { value: 'ADMIN@example.com' } ] }
  , { id: 2, username: 'jack', password: 'p', displayName: 'Jack', emails: [ { value: 'Jack@example.com' } ] }
  , { id: 3, username: 'peter', password: 'das', displayName: 'Peter', emails: [ { value: 'Peter@example.com' } ] }
];

const User = mongoose.model('User');

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}



var d = {name: 'lirik', display_name: 'LIRIK', logo:'https://static-cdn.jtvnw.net/jtv_user_pictures/27fdad08-a2c2-4e0b-8983-448c39519643-profile_image-300x300.png'};
var d2 = {name: 'summit1g', display_name: 'summit1g', logo:'https://static-cdn.jtvnw.net/jtv_user_pictures/200cea12142f2384-profile_image-300x300.png'};
var d3 = {name: 'ninja', display_name: 'Ninja', logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-300x300.png' };
var array = [];
array.push(d);
//array.push(d2);

//console.log(array);
//console.log(array);

var data = {
  username: 'simon',
  password: 'q',
  streamers: array
};

//const finalUser = new User(data);
//finalUser.save();
/*
var query = User.find().select( {'streamers': 1, '_id': 0});
query.exec(function (err, data) {
  console.log(data[1]['streamers'][0]['logo']);

});



User.findOne({username: 'simon'}, 
              function(err,obj) {
                console.log(obj)
                obj.setPassword('q')
                ////obj['streamers'].push(d3);
                //obj.markModified('streamers');
                obj.save();
                
              });
*/