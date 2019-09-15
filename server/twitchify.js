var request = require("request");
console.log('new twitchify');
var streamers = {};
var topStreamers = Array(20).fill(0);

var config = require('./config/config.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');

function getUser(mode, username, callback, optionalArg) {

    User.findOne(
        {username: username}, 
        function(err, user) {
            if(user) {
                switch(mode) {
                    case "getStreamers":
                        getStreamersData(user, callback);
                        break;
                    case "followGame":
                        togglefollowGame(user, optionalArg, callback);
                        break;
                }
            }
        }
    );
}

function togglefollowGame(user, streamerInfo, callback) {

    for(let streamer of user.streamers) {
        if(streamer.name == streamerInfo.streamerName) {

            
            switch(streamerInfo.callType) {
                case "follow":
                    if(!streamer.followedGames.includes(streamerInfo.gameName)) {
                        streamer.followedGames.push(streamerInfo.gameName)
                        user.save(function(err, obj) {
                            if(err) throw err;
                            callback(JSON.stringify(streamer.followedGames));
                        })
                    } else {
                        callback({error: 'already following'});
                    }
                    break;
                case "unfollow":
                    if(streamer.followedGames.includes(streamerInfo.gameName)) {
                        var index = streamer.followedGames.indexOf(streamerInfo.gameName)
                        streamer.followedGames.splice(index, 1);
                        user.save(function(err, obj) {
                            if(err) throw err;
                            callback(JSON.stringify(streamer.followedGames));
                        })
                    } else {
                        callback({error: 'already following'});
                    }
                    break;
            }
        }
    }

}

function getStreamersData(user, callback) {

    var streamers = JSON.parse(JSON.stringify(user.streamers));

    if(streamers.length == 0) {
        callback('[]')
        return;
    }

    var params = '';
    for(let streamer of streamers) {
        params += '&user_login=' + streamer.name;
        streamer['game'] = 'Offline';
        streamer['viewers'] = '0';
    }

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/helix/streams/?' + params,
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function(error, response, body) {
        if(response && response.statusCode != '200') {
            console.log('getStreamersData' + response.statusCode)
            callback({error: response.statusCode})
            return;
        }
        var body = JSON.parse(body);


        for(let streamer of streamers) {
            for(let liveStream of body.data) {
                if(streamer.id == liveStream.user_id) {
                    streamer['viewers'] = liveStream.viewer_count;
                    streamer['game'] = liveStream.game_id;
                }
            }

        }

        convertGameIdToGameName(streamers, callback);

    });
}

function convertGameIdToGameName(streamers, callback) {
    requestParameters = '';
    for(let streamer of streamers) {
        if(streamer.game != 'Offline') {
            requestParameters += '&id=' + streamer.game;
        }
    }
    requestParameters = requestParameters.substr(1);

    if(requestParameters.length === 0) {
        callback(JSON.stringify(streamers));
        return;
    }

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
            console.log('convertGameIdToGameName' + response.statusCode)
            callback({error: response.statusCode})
            return;
        }

        body = JSON.parse(body);
        body = body.data;

        var gameIdToGameName = {};
        for(let game of body) {
            gameIdToGameName[game.id] = game.name;
        }

        for(let streamer of streamers) {
            if(streamer.game != "Offline") {
                streamer.game = gameIdToGameName[streamer.game];
            }
        }
        
        callback(JSON.stringify(streamers));
    });
}



function unfollowStreamer(username, nameToUnfollow, callback) {
    User.findOne({username: username}, 
        function(err,streamer) {
            if(streamer) {
                for([index, stream] of Object.entries(streamer['streamers'])) {
                    if(stream['name'] === nameToUnfollow) {
                        if (index > -1) {
                            streamer['streamers'].splice(index, 1);
                        }
                        streamer.save();
                        callback({code : '200'})
                        break;
                    }
                }
            }
        });
}

function followStreamer(username, nameToFollow, callback) {
    User.findOne({"username" : username, "streamers.name" : {"$in": nameToFollow}}, 
        function(err, user) {

            if(user) {
                callback({error : 'already following ' + nameToFollow})
            } else {
                insertStreamerData(username, nameToFollow, callback);
            }
        }
    );
    
}

function insertStreamerData(username, nameToFollow, callback) {


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
            callback({code : response.statusCode})
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
                    callback({code : '200'})
                    return;
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
            var streamerData = {};
            streamerData['name'] = name;
            if(streamer) {
                for(var [id, followedStreamer] of Object.entries(streamer.streamers)) {
                    if(followedStreamer.name == name) {
                        streamerData['isFollowed'] = true;
                        streamerData['followedGames'] = JSON.stringify(followedStreamer.followedGames);
                        getStreamerInfo(streamerData, callback);
                        return;
                    }
                }
            } 
            streamerData['isFollowed'] = false;
            streamerData['followedGames'] = '[]';
            getStreamerInfo(streamerData, callback);
        }
    );
    
}

function getStreamerInfo(streamerData, callback) {
    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=' + streamerData.name,
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
        
        streamerData['id'] = body['id'];
        streamerData['logo'] = body['profile_image_url'];
        streamerData['display_name'] = body['display_name'];
        
        streamerData['preview'] = body['offline_image_url'];

        if(body['description'] == '') {
            streamerData['description'] = "I did not bother to write a description! -" + streamerData['display_name'];
        } else {
            streamerData['description'] = body['description'];
        }
        
    
        getStream(body['login'], streamerData, callback)
        


    });
}

function getStream(name, streamerData, callback) {

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

        var recentGamesArray = Array.from(recentGames)
        getRecentGamesBoxArt(recentGamesArray, callback, streamerData)
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

    if(streamerData['game'] != "Offline") {
        requestParameters += '&id=' + streamerData['game']
    }
    
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

        if(streamerData['game'] != "Offline") {
            streamerData['game'] = body.data[0]['name'];
        }

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

function search(category, query, callback) {

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/search/' + category + '?query=' + query + "&limit=10",
        //url: 'https://api.twitch.tv/kraken/search/games?query=star',
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
            callback({error: response.statusCode})
            return;
        }

        switch(category) {
            case 'channels':
                body = JSON.parse(body).channels;
                break;
            case 'games':
                body = JSON.parse(body).games;
                if(!body) body = [];
                body = body.slice(0, 5)
                break;
        }

        callback(body)
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
module.exports.getUser = getUser;
module.exports.topStreamers = topStreamers;
module.exports.search = search;