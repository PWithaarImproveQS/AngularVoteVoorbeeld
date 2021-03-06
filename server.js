//
// # SimpleServer
//
// A server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var cookie = require("cookie");
var cookieParser = require('cookie-parser');
var router = express();
router.use(express.cookieParser());
router.use(express.session({secret: 'secret', key: 'express.sid'}));
router.use(express.static(path.resolve(__dirname, 'client')));

var server = http.createServer(router);
var io = socketio.listen(server);


// Init clear server variables
var linearVoteOption = require('./lib/linearVote.js');
var sockets = [];
var options = [];
var votedSockets = [];


// On connection try this
 
io.on('connection', function (socket) {
    var sessionID = socket.request.sessionID || socket.id;
    console.log('A socket with sessionID ' + sessionID + ' connected');
    
    socket.on('disconnect', function(){
        console.log('A socket with sessionID ' + sessionID + ' disconnected');
    });
    
    socket.on('getoptions', function(){
      socket.emit('refresh', options);
      hasVoted(socket,sessionID);
    });
   
    sockets.push(socket);
    socket.on('send', function (text) {
      console.log("Send " + text );

      var newOption = new linearVoteOption();
      newOption.setDescription(text);
      
      options.push(newOption);
      broadcast("voteItem",newOption);
    });
    
    socket.on('vote', function(option) {
      console.log('we got a vote: ' + option.name + " from " + sessionID);
    
      if (!hasVoted(socket, sessionID)) {
        giveVoteOnName(option.name);
        votedSockets.push(sessionID);
        hasVoted(socket,sessionID);
      } else
      {
        console.log("Vote Rejected");
        socket.emit('rejected', option);
      }
    });
    
    socket.on('reset', function() {
      console.log("reset data");
      options = [];
      votedSockets = [];
      broadcast('refresh', options);
      broadcastHasVotes();
    });
    
    socket.on('resetvotes', function() {
      console.log("reset votes");
      resetVotes();
      votedSockets = [];
      
      broadcast('refresh', options);
      broadcastHasVotes();
    });
 
});

function hasVoted(socket, sessionID) {
  for (var i = 0; i < votedSockets.length; i++) {
    if (votedSockets[i] === sessionID)
    {
      socket.emit('hasvoted', true);
      return true;
    }
  }
  socket.emit('hasvoted', false);
  return false;
}
  
  
function resetVotes() {
  console.log("Reset all the votes");
  for (var i = 0; i < options.length; i++) {
         options[i].reset();
  }
}

function giveVoteOnName(name) {
  console.log("Got a vote on " + name);
  for (var i = 0; i < options.length; i++) {
       if (name == options[i].name)
       {
         options[i].giveVote();
         broadcast('votedFor', options[i]);
         broadcastHasVotes();
       }
  }
}

function broadcastHasVotes() {
   sockets.forEach(function (socket) {
    hasVoted(socket);
  });
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}



exports.closeServer = function closeServer(done) {
    server.close(done);
};

exports.resetServer = function resetServer(done) {
  options = [];
  votedSockets = [];
};

exports.startServer = function startServer(useCookie, port, ip, callback)
{ 
  server.listen(process.env.PORT || port, process.env.IP ||ip, function()
  {
  
   if (useCookie)
   {
   io.set('authorization', function (handshakeData, accept) {
      
      if (handshakeData.headers.cookie ) {
    
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
        
        handshakeData.sessionID =  cookieParser.signedCookie(handshakeData.cookie['express.sid'], 'secret');
        console.log("Session ID : " + handshakeData.sessionID);
        
        if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
          return accept('Cookie is invalid.', false);
        }
    
      } else {
        return accept('No cookie transmitted.', true);
      } 
    
      accept(null, true);
    });
   }

  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
  callback();
})};
