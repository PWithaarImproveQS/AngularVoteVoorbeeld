
var assert = require('assert');
var generalTimeout = 5000;
var ioclient = require('socket.io/node_modules/socket.io-client');
var serverTests = function () {
var client;
var linearVoteOption = require('../../lib/linearVote.js');

  this.World = require("../support/world.js").World;
  
  
  this.Before(function(done) {
      this.startServer(done);
  });
  
  this.After(function(done) {
      client.emit('disconnect');
      client.close();
      
      this.stopServer(done);
  });
  
 
  
  this.Given(/^a connection to the server$/, function (done) {
    ConnectClientToServer(done);
  });
  
  this.When(/^I send a new vote item$/, function (done) {
    SendVoteItem("NewVoteItem",done);
  });
  
  this.Then(/^the amount of vote items is (\d+)$/, function (amount, done) {
    CheckAmountOfVoteItemsIs(amount,done);
    
  });
  
  this.Given(/^A votable item "([^"]*)"$/, function (text, done) {
    this.resetServer();
    
    SendVoteItem(text,done);
  });
  
  this.When(/^Susan votes on "([^"]*)"$/, function (text, done) {
    
    VoteOnValid(text,done);
  });
  
  this.When(/^Susan votes again on "([^"]*)"$/, function (text, done) {
    VoteOnReject(text,done);
  });

  this.Then(/^The total amount of votes on "([^"]*)" is (\d+)$/, function (text, amount, done) {
     console.log(amount + " " + text);
     CheckAmountOfVotesOnItemIs(text, amount, done); 
  });
  
  
   function ConnectClientToServer(done)
  {
      client = ioclient.connect('http://127.0.0.1:8080', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        }); 
    
      var timeoutID = setTimeout(function(){
            done.fail(new Error("Not connected"));
      }, generalTimeout);
  
      client.once('connect', function() {
        clearTimeout(timeoutID);
        done();
      });  
  }
  
  function SendVoteItem(text, done)
  {
    client.emit("send", text);
    var timeoutID = setTimeout(function(){
          done.fail(new Error("The vote item : " + text + " didn't process well"));
    }, generalTimeout);

    client.once('voteItem', function(newOption) {
      assert.equal(newOption.name,text);
      clearTimeout(timeoutID);
      done();
    });
  }
  
  
  function VoteOnValid(text, done)
  {
    var option = new linearVoteOption();
    option.name = text;
    client.emit("vote", option);
    
    var timeoutID = setTimeout(function(){
            done.fail(new Error("Expected a vote. It seems rejected"));
    }, generalTimeout);

    client.on('votedFor', function(option) {
      console.log("voted for " + option.name);
      clearTimeout(timeoutID);
      done();
    });
  }
  
  function VoteOnReject(text, done)
  {
    var option = new linearVoteOption();
    option.name = text;
    client.emit("vote", option);
    
    var timeoutID = setTimeout(function(){
            done.fail(new Error("The vote is not rejected"));
    }, generalTimeout);

    client.on('rejected', function(option) {
      console.log("rejected vote for " + option.name);
      clearTimeout(timeoutID);
      done();
    });
  }
  
  function CheckAmountOfVotesOnItemIs(text, amount, done)
  {
      client.emit('getoptions');
    
      var timeoutID = setTimeout(function(){
            done.fail(new Error("amount of voteitems is not correct"));
      }, generalTimeout);
  
      client.once('refresh', function(options) {
        clearTimeout(timeoutID);
        var totalAmount = 0;
        for (var i = 0; i < options.length; i++) {
          if (text == options[i].name)
          {
            totalAmount += options[i].numberOfVotes;
          }
        }
        assert.equal(totalAmount, amount);
        done();
          
      });

  }
  
  function CheckAmountOfVoteItemsIs(expectedAmount, done)
  {
     client.emit('getoptions');
    
      var timeoutID = setTimeout(function(){
            done.fail(new Error("amount of voteitems is not correct"));
      }, generalTimeout);
  
      client.once('refresh', function(options) {
        assert.equal(options.length,expectedAmount);
        clearTimeout(timeoutID);
        done();
      });
  }
};

module.exports = serverTests;
