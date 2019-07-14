const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

var streamerTable;

function connectToDb(callback) {
  mongoose.connect('mongodb://localhost:27017/twitchify',  { useNewUrlParser: true });

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function dbAccess() {
    console.log("mongoose connected");
    console.log('connected to db');

    callback();
    

  });

  setSchemas();



}


function setSchemas() {
  var Schema = mongoose.Schema;
  var streamersSchema = new Schema({
      _id : String,
      display_name : String,
      logo : String
  });
  streamerTable = mongoose.model("Streamers", streamersSchema);
}



function createStreamer(data) {

  var data = {
    //_id: new ObjectID(),
    _id: data['name'],
    display_name: data['display_name'],
    logo: data['logo']
  };

  var str = new streamerTable(data);
  str.save(function (err) {
      if (err) {
        console.log(err);
      }
  })
}

function getStreamers(callback) {
  var query = streamerTable.find().select( {'__v': 0});
  query.exec(function (err, data) {
    callback(data);
  });
}

//setInterval(function () { getStreamers() }, 5000)

// Exports
module.exports.getStreamers = getStreamers;
module.exports.createStreamer = createStreamer;
module.exports.connectToDb = connectToDb;


//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"
///taskkill /F /IM node.exe