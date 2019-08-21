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
    console.log("===IN ADD STREAMERS===");

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
            }
        );
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
        url: 'https://api.twitch.tv/kraken/channels/' + nameToFollow,
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
        streamerData['name'] = body['name'];
        streamerData['logo'] = body['logo'];
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
        streamerData['preview'] = body['stream']['preview']['large'];
        streamerData['profile_banner'] = body['stream']['channel']['profile_banner'];
        streamerData['isFollowed'] = Boolean(isFollowed).toString();
    
        getRecentGamesPlayed(name, callback, streamerData);

    });

    


}

function getRecentGamesPlayed(name, callback, streamerData) {

    var options = {
        method: 'GET',
        url: "https://api.twitch.tv/kraken/channels/" + name + "/videos?broadcast_type=archive&limit=50",
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var body = JSON.parse(body);
        console.log(body)
        var videos = body.videos;
        console.log(videos.length)
        var recentGames = new Set();
        for(var [id, video] of Object.entries(videos)) {
            recentGames.add(video.game)
        }
        console.log(recentGames)

        var recentGamesArray = Array.from(recentGames)
        getRecentGamesBoxArt(recentGamesArray, callback, streamerData)
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
        streamerData['profile_banner'] = body['profile_banner'];
        streamerData['isFollowed'] = Boolean(isFollowed).toString();
        getRecentGamesPlayed(name, callback, streamerData);

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
        if (error) throw new Error(error);
        var body = JSON.parse(body)['streams'];

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

    console.log(recentGames.length)

    var requestParameters = '';

    Array.from(recentGames).forEach((recentGame) => {
        requestParameters += '&name=' + recentGame
    })

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
        if (error) throw new Error(error);
        body = body.replace(/{width}/g, '200')
        body = body.replace(/{height}/g, '300')
        console.log(body)
        var body = JSON.parse(body);

        console.log(body.data)
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