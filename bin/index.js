#!/usr/bin/env node

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var meow = require('meow');

var cli = meow({
  pkg: require('../package.json'),
  help: [
    'Usage:',
    '  peer-hub [options]',
    '',
    'Options:',
    '  -p <port number>, --port <port number>    change default served port number',
    '',
    'Examples:',
    '  peer-hub',
    '  peer-hub -p 2000',
    '  peer-hub -p 8080',
  ].join('\n'),
});

io.on('connection', function(socket){
    socket.on('join', function(room) {
      // Get the list of peers in the room
      var peers = io.nsps['/'].adapter.rooms[room] ?
                Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : {}
      
      // Send them to the client
      socket.emit('peers', peers);
      // And then add the client to the room
      socket.join(room);
    });

    socket.on('signal', function(data) {
      var client = io.sockets.connected[data.id];
      client && client.emit('signal', {
        id: socket.id,
        signal: data.signal,
      });
    });
});

if (!(cli.flags.h || cli.flags.help || cli.flags.version)) {
  var port = cli.flags.p || cli.flags.port || 3000;
  http.listen(port, function(){
    console.log('listening on *:' + port);
  });
} else if (cli.flags.h || cli.flags.help) {
  console.log(cli.help);
} else if (cli.flags.version) {
  console.log(cli.version);
}
