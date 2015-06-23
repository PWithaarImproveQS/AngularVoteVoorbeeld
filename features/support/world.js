var io = require('socket.io/node_modules/socket.io-client');
var port = 8080;
var ip = '0.0.0.0';
var voteServer = require('../../server.js');

function World(callback) {
    (function(){
      var oldLog = console.log;
      console.log = function (message) {
        
          //oldLog.apply(console, arguments);
      };
    })();
    
    this.startServer = function(callback)
    {
      voteServer.startServer(false,port,ip );
    };
    
    this.stopServer = function(callback)
    {
       voteServer.close(callback);
    };
    
    this.connect = function (port, callback) {
       var socket = io.connect('http://' + ip + ':' + port);
       return socket;
    };
    
    this.disconnect = function (socket, callback) {
       socket.close();
    };
    
   
    
    callback(); // tell Cucumber we're finished and to use 'this' as the world instance
}

module.exports.World = World;

