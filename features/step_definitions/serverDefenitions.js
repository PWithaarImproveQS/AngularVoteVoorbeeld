var assert = require('assert');

var serverTests = function () {
var sockets = [];

  this.World = require("../support/world.js").World;
  
  
  this.Before(function(done) {
       this.startServer(false);
       done();
       
  });
  
  this.After(function(done) {
      console.log('TestCase Exit >>>');
      this.disconnect(sockets[0], done);
      this.stopServer();
      done();
  });
      
  this.Given(/^a connection to the server$/, function (done) {
    // Write code here that turns the phrase above into concrete actions
  
   sockets.push(this.connect(8080, done));
    
   var timeoutID = setTimeout(function(){
           done.fail(new Error("Not connected"));
    }, 5000);

    sockets[0].on('connect', function() {
      clearTimeout(timeoutID);
      done();
    });  
    
  });
  
  this.When(/^I send a vote item with the text:([^"]*)$/, function (text, done) {
    // Write code here that turns the phrase above into concrete actions
    sockets[0].emit("send", text);
   
    done();
  });
  
  this.Then(/^the amount of vote items is (\d+)$/, function (arg1, done) {
    // Write code here that turns the phrase above into concrete actions
    sockets[0].emit('getoptions');
    var timeoutID = setTimeout(function(){
           done.fail(new Error("amount of voteitems is not correct"));
    }, 5000);

    sockets[0].on('refresh', function(options) {
      
      assert.equal(options.length,1);
      clearTimeout(timeoutID);
      this.disconnect();
      done();
    });
  });
  
  this.Then(/^the name of the vote item is New vote item$/, function (done) {
    // Write code here that turns the phrase above into concrete actions
    done();
  });
};

module.exports = serverTests;
