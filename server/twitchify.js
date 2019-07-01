var request = require("request");
console.log('new twitchify');
var streamers = {};
var topStreamers = [];

var config = require('./config.js');



function getStreamers() {
    var ret = [];
    for (var streamer of Object.entries(streamers)) {
        if (streamer[1]['data']['stream']) {
            ret.push({ name: streamer[1]['name'], game: streamer[1]['data']['stream']['game'], viewers: streamer[1]['data']['stream']['viewers'], logo: streamer[1]['data']['stream']['channel']['logo'] });
        } else {
            ret.push({ name: streamer[1]['name'], game: 'Offline', viewers: 0, logo: 'default' });
        }
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
        var streamerData = {};
        streamerData['logo'] = body['stream']['channel']['logo'];
        streamerData['name'] = body['stream']['channel']['display_name'];
        streamerData['viewers'] = body['stream']['viewers'];
        streamerData['game'] = body['stream']['game'];
        streamerData['preview'] = body['stream']['preview']['large'];
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
    streamers['summit1g'] = new Streamer('summit1g');
    streamers['kitboga'] = new Streamer('kitboga');
}

function addStreamer(name) {
    streamers[name] = new Streamer(name);
    updateStreamers();
}

class Streamer {
    constructor(name) {
        this.name = name;
        this.data = '';
    }

    getName() {
        return this.name;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }
}

addStreamers();
updateStreamers();
setInterval(function () { updateStreamers() }, 30000)
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