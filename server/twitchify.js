var request = require("request");
console.log('new twitchify');
var streamers = {};
var topStreamers = Array(20).fill(0);

var config = require('./config/config.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');

    //user id
    //get streamers coresponding to user id from db
    //channel is already there
    //update streamers
    //callback return

function getStreamers(username, callback) {
    console.log(username);
    console.log("===IN GET STREAMERS===");

    User.findOne(
        {username: username}, 
        function(err, obj) {
            if(obj) {
                console.log('found user');
                getStreamersData(obj, callback);
            }
        }
    );
}

function getStreamersData(user, callback) {
    var ret = [];
    var streamers = user.streamers;
    Array.from(streamers).forEach((streamer) => {
        var options = {
            method: 'GET',
            url: 'https://api.twitch.tv/kraken/streams/' + streamer['name'],
            headers:
            {
                'Client-ID': config.clientid
            }
        };
        request(options, function(error, response, body) {
            if(response && response.statusCode != '200') {
                console.log(response.statusCode)
                callback({error: response.statusCode})
            }
            var body = JSON.parse(body);

            var streamerData = {};
            streamerData['name'] = streamer['name'];
            streamerData['display_name'] = streamer['display_name'];
            streamerData['viewers'] = '0';
            streamerData['game'] = 'Offline';
            streamerData['logo'] = streamer['logo'];
            streamerData['preview'] = streamer['logo'];
    
            if(body['stream']) {
                streamerData['viewers'] = body['stream']['viewers'];
                streamerData['game'] = body['stream']['game'];
            }

            
            ret.push(streamerData);
            if(ret.length == streamers.length) {
                callback(ret);
            }
        });
    });
}

function unfollowStreamer(username, nameToUnfollow) {
    User.findOne({username: username}, 
        function(err,streamer) {
            if(streamer) {
                for([index, stream] of Object.entries(streamer['streamers'])) {
                    if(stream['name'] === nameToUnfollow) {
                        if (index > -1) {
                            streamer['streamers'].splice(index, 1);
                        }
                        streamer.save();
                        break;
                    }
                }
            }
        });
}

function followStreamer(username, nameToFollow) {

    var options = {
        method: 'GET',
        //url: 'https://api.twitch.tv/kraken/channels/' + nameToFollow,
        url: 'https://api.twitch.tv/helix/users?login=' + nameToFollow,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if(response && response.statusCode != '200') {
            console.log(response.statusCode)
            return;
        }

        body = JSON.parse(body).data[0];

        var streamerData = {};
        streamerData['id'] = body['id'];
        streamerData['name'] = body['login'];
        streamerData['logo'] = body['profile_image_url'];
        streamerData['display_name'] = body['display_name'];

        User.findOne({username: username}, 
            function(err,streamer) {
                if(streamer) {
                    streamer['streamers'].push(streamerData);
                    streamer.save();
               }
            });
    });
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
    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=' + name,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if(response && response.statusCode != '200') {
            console.log(response.statusCode);
            callback({error: response.statusCode});
            return;
        }

        body = JSON.parse(body);

        body = body.data[0];

        var streamerData = {};
        
        streamerData['id'] = body['id'];
        streamerData['logo'] = body['profile_image_url'];
        streamerData['name'] = body['login'];
        streamerData['display_name'] = body['display_name'];
        streamerData['description'] = body['description'];
        streamerData['preview'] = body['offline_image_url'];
        streamerData['isFollowed'] = Boolean(isFollowed).toString();
    
        getStream(name, streamerData, callback)
        


    });
}

function getStream(name, streamerData, callback) {
    console.log(name);

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/helix/streams?user_login=' + name,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if(response && response.statusCode != '200') {
            console.log(response.statusCode)
            callback({error: response.statusCode})
            return;
        }

        body = JSON.parse(body);

        body = body.data[0];
        //console.log(body)


        if(body) {
            streamerData['viewers'] = body['viewer_count'];
            streamerData['game'] = body['game_id'];
            streamerData['title'] = body['title'];
            var thumbnail_url = body['thumbnail_url'];
            thumbnail_url = thumbnail_url.replace(/{width}/g, '700')
            thumbnail_url = thumbnail_url.replace(/{height}/g, '400')
            streamerData['preview'] = thumbnail_url;
        } else {
            streamerData['viewers'] = 0;
            streamerData['game'] = 'Offline';
            streamerData['title'] = 'Stream is currently offline';
        }

        getRecentGamesPlayed(name, callback, streamerData);

    });
}

function getRecentGamesPlayed(name, callback, streamerData) {
    var options = {
        method: 'GET',
        url: "https://api.twitch.tv/kraken/channels/" + streamerData['id'] + "/videos?broadcast_type=archive&limit=50",
        headers:
        {
            'Client-ID': config.clientid,
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    };

    request(options, function (error, response, body) {
        if(response && response.statusCode != '200') {
            console.log(response.statusCode)
            callback({error: response.statusCode})
            return;
        }

        body = JSON.parse(body);
        var videos = body.videos;
        var recentGames = new Set();
        for(var [id, video] of Object.entries(videos)) {
            recentGames.add(video.game.toLowerCase())
        }
        console.log(recentGames)

        var recentGamesArray = Array.from(recentGames)
        getRecentGamesBoxArt(recentGamesArray, callback, streamerData)
    });

}

function getTopStreamers() {

    console.log('getting top streamers')

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
        if(response && response.statusCode != '200') {
            console.log(response.statusCode)
            return;
        }

        body = JSON.parse(body)['streams'];

        for([key, stream] of Object.entries(body)) {
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

            topStreamers[key] = streamerData;
        }
    });
}

function getRecentGamesBoxArt(recentGames, callback, streamerData) {

    //console.log(recentGames.length)

    var requestParameters = '';

    Array.from(recentGames).forEach((recentGame) => {
        var alphaNumeric = /^[a-z\d\-_\s\'\!\:\+]+$/i;
        if(recentGame.match(alphaNumeric)) {
            requestParameters += '&name=' + recentGame
        }
    })

    requestParameters += '&id=' + streamerData['game']

    requestParameters = requestParameters.substr(1);


    var options = {
        method: 'GET',
        url: "https://api.twitch.tv/helix/games?" + requestParameters,
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if(response && response.statusCode != '200') {
            console.log(response.statusCode)
            callback({error: response.statusCode})
            return;
        }

        body = body.replace(/{width}/g, '200')
        body = body.replace(/{height}/g, '300')
        body = JSON.parse(body);



        streamerData['game'] = body.data[0]['name'];

        //console.log(body)
        var boxArts = [body.data.shift()]

        boxArts.map(boxArt => {
            if(boxArt.name.length > 20) {
                boxArt.name = boxArt.name.substring(0,20) + '...';
            }
        })

        streamerData['recentGames'] = JSON.stringify(body.data);

        callback(streamerData);

    });
}

function startTopStreamers() {
    getTopStreamers();
    setInterval(getTopStreamers, 60000)
}

startTopStreamers()
console.log('=========== twitchify started ============')

module.exports.streamers = streamers;
module.exports.getStreamer = getStreamer;
module.exports.followStreamer = followStreamer;
module.exports.unfollowStreamer = unfollowStreamer;
module.exports.getStreamers = getStreamers;
module.exports.topStreamers = topStreamers;