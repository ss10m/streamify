var request = require("request");
console.log('new twitchify');
var streamers = {};
var topStreamers = [];

var config = require('./config.js');
//var mongodb = require('./mongodb.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');

    //user id
    //get streamers coresponding to user id from db
    //channel is already there
    //update streamers
    //callback return

function getStreamers(username, callback) {
    console.log(username);
    console.log("===IN ADD STREAMERS===");

    User.findOne({username: username}, 
        function(err,obj) {
            console.log(obj)
            if(obj) {
                console.log('found user');
                getStreamersData(obj, callback);
            }
        });
}

function getStreamersData(user, callback) {
    var ret = [];
    var streamers = user.streamers;
    Array.from(streamers).forEach(function (streamer) {
        (function(streamer) {
            request( 
                {
                    method: 'GET',
                    url: 'https://api.twitch.tv/kraken/streams/' + streamer['name'],
                    //qs: { offset: '0', limit: '2' },
                    headers:
                    {
                        'Client-ID': config.clientid
                    }
                },

                function(err, res, body) {
                    var body = JSON.parse(body);

                    //console.log(body);
                    var streamerData = {};
                    streamerData['name'] = streamer['name'];
                    streamerData['display_name'] = streamer['display_name'];
                    streamerData['viewers'] = '0';
                    streamerData['game'] = 'Offline';
                    streamerData['logo'] = streamer['logo'];
                    streamerData['preview'] = streamer['logo'];
            
                    if (body['stream']) {
                        streamerData['viewers'] = body['stream']['viewers'];
                        streamerData['game'] = body['stream']['game'];
                    }

                    
                    ret.push(streamerData);
                    if(ret.length == streamers.length) {
                        callback(ret);
                    }
                });
        })(streamer);
    });
    
}





function followStreamer(username, nameToFollow) {

    //check if exists in db
    //if not


    console.log(nameToFollow);

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/channels/' + nameToFollow,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log('response');
        //console.log(response);
        var body = JSON.parse(body);

        var streamerData = {};
        streamerData['name'] = body['name'];
        streamerData['logo'] = body['logo'];
        streamerData['display_name'] = body['display_name'];
        
        //mongodb.createStreamer(streamerData);

        User.findOne({username: username}, 
            function(err,streamer) {
                if(streamer) {
                    console.log(streamer);
                    console.log(streamerData);
                    streamer['streamers'].push(streamerData);
                    streamer.save();
                }
            });

    });


    
}












////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////




function updateStreamers() {

    console.log('!!!!===== updating  streamers =====!!!!')
    //streamers.push(new Streamer('summit'.concat(streamers.length).concat('g')));

    for (var [name, streamer] of Object.entries(streamers)) {

        var options = {
            method: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/' + streamer.getName(),
            //qs: { offset: '0', limit: '2' },
            headers:
            {
                'Client-ID': config.clientid
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            //console.log('response');
            //console.log(response);
            var streamerName = response['req']['path'].split("/")[3].split("?")[0];
            var body = JSON.parse(body);
            streamers[streamerName].setData(body);

        });




    };

}

function getStreamer(auth, name, callback) {
    checkIfFollowing(auth, name, callback)
}

function checkIfFollowing(auth, name, callback) {
    User.findOne({username: auth.username}, 
        function(err, streamer) {
            if(streamer) {
                for(var [id, followedStreamer] of Object.entries(streamer.streamers)) {
                    if(followedStreamer.name == name) {
                        console.log(auth.username + ' is following ' + name)
                        getStreamerInfo(true, name, callback);
                        return;
                    }
                }
            } 
            getStreamerInfo(false, name, callback);
            console.log('not following ' + name)
        });
    
}



function getStreamerInfo(isFollowed, name, callback) {
    console.log(name);

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/streams/' + name,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var body = JSON.parse(body);

        if(!body['stream']) {
            getChannel(isFollowed, name, callback);
            return;
        }

        var streamerData = {};
        streamerData['logo'] = body['stream']['channel']['logo'];
        streamerData['name'] = body['stream']['channel']['name'];
        streamerData['display_name'] = body['stream']['channel']['display_name'];
        streamerData['viewers'] = body['stream']['viewers'];
        streamerData['game'] = body['stream']['game'];
        //streamerData['preview'] = body['stream']['preview']['large'];
        streamerData['preview'] = body['stream']['channel']['profile_banner'];
        streamerData['isFollowed'] = Boolean(isFollowed).toString();
        callback(streamerData);

    });
}

function getChannel(isFollowed, name, callback) {
    console.log(name);

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/channels/' + name,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var body = JSON.parse(body);

        var streamerData = {};
        streamerData['logo'] = body['logo'];
        streamerData['name'] = body['name'];
        streamerData['display_name'] = body['display_name'];
        streamerData['viewers'] = '0';
        streamerData['game'] = 'Offline';
        streamerData['preview'] = body['profile_banner'];
        streamerData['isFollowed'] = Boolean(isFollowed).toString();;
        callback(streamerData);

    });
}

function getTopStreamers() {

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/streams?limit=20',
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid,
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var body = JSON.parse(body)['streams'];

        for([key, stream] of Object.entries(body)) {
            //console.log(stream)
            var streamerData = {};
            streamerData['name'] = stream['channel']['name'];
            streamerData['display_name'] = stream['channel']['display_name'];
            streamerData['viewers'] = stream['viewers'];
            var game = stream['game'];
            if(game.length > 20) {
                game = game.substring(0,20) + '...';
            } else if(game == '') {
                game = 'Nothing'
            }
            streamerData['game'] = game;
            streamerData['logo'] = stream['channel']['logo'];

            topStreamers.push(streamerData);
        }

    });
    
}



function dbConnected() {
    console.log("dbConnected in twitchify");
    //getStreamersNEW();
}



//mongodb.connectToDb(dbConnected);
//setInterval(function () { updateStreamers() }, 60000)
getTopStreamers();

function printStreamers() {
    console.log('============== printing streamers ===============')
    for (var [key, value] of Object.entries(streamers)) {
        console.log(key, value);
    }
}




// Exports
module.exports.streamers = streamers;
module.exports.getStreamer = getStreamer;
module.exports.printStreamers = printStreamers;
module.exports.followStreamer = followStreamer;
module.exports.getStreamers = getStreamers;
module.exports.topStreamers = topStreamers;