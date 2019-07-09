var request = require("request");
console.log('new twitchify');
var streamers = {};
var topStreamers = [];

var config = require('./config.js');
var mongodb = require('./mongodb.js');



function getStreamers() {
    var ret = [];
    for (var [name, streamer] of Object.entries(streamers)) {
        var streamerData = {};
        var streamerChannel = streamer.getChannel();
        streamerData['logo'] = streamerChannel['logo'];
        streamerData['name'] = streamerChannel['display_name'];
        streamerData['viewers'] = '0';
        streamerData['game'] = 'Offline';
        streamerData['preview'] = streamerChannel['logo'];

        if (streamer['data']['stream']) {
            streamerData['viewers'] = streamer['data']['stream']['viewers'];
            streamerData['game'] = streamer['data']['stream']['game'];
        }
        ret.push(streamerData);
    }

    return ret;
}


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

function getStreamer(name, callback) {
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
        //console.log('response');
        //console.log(response);
        var body = JSON.parse(body);
        console.log(body);


        if(!body['stream']) {
            getChannel(name, callback);
            return;
        }

        var streamerData = {};
        streamerData['logo'] = body['stream']['channel']['logo'];
        streamerData['name'] = body['stream']['channel']['display_name'];
        streamerData['viewers'] = body['stream']['viewers'];
        streamerData['game'] = body['stream']['game'];
        streamerData['preview'] = body['stream']['preview']['large'];
        callback(streamerData);

    });
}

function getChannel(name, callback) {
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
        //console.log('response');
        //console.log(response);
        var body = JSON.parse(body);

        if(callback) {
            var streamerData = {};
            streamerData['logo'] = body['logo'];
            streamerData['name'] = body['display_name'];
            streamerData['viewers'] = '0';
            streamerData['game'] = body['game'];
            streamerData['preview'] = body['profile_banner:'];
            callback(streamerData);
        } else {
            streamers[name].setChannel(body);
        }

    });
}

function getTopStreamers() {

    var options = {
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/streams?limit=20',
        //qs: { offset: '0', limit: '2' },
        headers:
        {
            'Client-ID': config.clientid
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var body = JSON.parse(body)['streams'];

        for([key, stream] of Object.entries(body)) {
            var streamerData = {};
            streamerData['name'] = stream['channel']['display_name'];
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


function addStreamers() {

    console.log("===IN ADD STREAMERS===");

    mongodb.getStreamers(function(data) {
        data.forEach( (i) => 
            addStreamer(i['name'])
        );
        
    });
}

function follows(name) {
    return streamers[name] !== undefined;
}

function addStreamer(name) {
    if(follows(name)) {
        return;
    }

    streamers[name] = new Streamer(name);
    updateStreamers();
    getChannel(name);
    mongodb.createStreamer(name);
    streamers[name].getChannel();

}

class Streamer {
    constructor(name) {
        this.name = name;
        this.data = '';
        this.channel = '';
    }

    getName() {
        return this.name;
    }

    setData(data) {
        this.data = data;
    }

    setChannel(channel) {
        this.channel = channel;
    }

    getChannel() {
        return this.channel;
    }

    getData() {
        return this.data;
    }
}

function dbConnected() {
    console.log("dbConnected in twitchify");
    addStreamers();
}



mongodb.connectToDb(dbConnected);
setInterval(function () { updateStreamers() }, 60000)
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
module.exports.addStreamer = addStreamer;
module.exports.getStreamers = getStreamers;
module.exports.topStreamers = topStreamers;