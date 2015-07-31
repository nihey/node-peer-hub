#!/usr/bin/env node

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('join', function(room) {
      // Get the list of peers in the room
      var peers = Object.keys(io.nsps['/'].adapter.rooms['foobar'] || {});
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

    socket.on('disconnect', function() {
      console.log('a user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
