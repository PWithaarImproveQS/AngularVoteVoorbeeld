
function World(callback) {
    var voteServer = require('../../server.js');
    var port = 8080;
    var ip = '127.0.0.1';
    
    (function(){
        // comment unterneath out to get logging
        
      console.log = function (message) {  };
      
    })();
    
    this.startServer = function(callback)
    {
      voteServer.startServer(false,port,ip,done);
    };
    
    function done() {
        console.log("Done");
    }
    
    this.stopServer = function(callback)
    {
        voteServer.closeServer(done);
        
    };
    
    this.resetServer = function(callback)
    {
        voteServer.resetServer(callback);
    };
    
    callback(); // tell Cucumber we're finished and to use 'this' as the world instance
}

module.exports.World = World;

