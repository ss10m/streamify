console.log('mongoose')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/twitchify',  { useNewUrlParser: true });

var Schema = mongoose.Schema;
var streamersSchema = new Schema({
    _id : String,
    display_name : String,
    logo : String
});
streamerTable = mongoose.model("Streamers", streamersSchema);

var query = streamerTable.find().select( {'__v': 0});
query.exec(function (err, data) {
  //console.log(data);
});