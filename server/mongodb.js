const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/twitchify');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("mongoose connected");
});



//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"