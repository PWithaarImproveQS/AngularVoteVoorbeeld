  function VotingController($scope) {
    var socket = io.connect();
    $scope.totalVotes = 0;
    $scope.voted = false;
    
    $scope.options = [];
    $scope.inputText = '';
    
    function giveVoteOnOption(option) {
      for (var i = 0; i < $scope.options.length; i++) {
             if (option.name == $scope.options[i].name)
             {
               $scope.options[i].numberOfVotes = option.numberOfVotes;
               $scope.$apply();
             }
      }
      calculatePercentage();
    }
    
    
    function calculatePercentage() {    
      console.log("calculatePercentage");
      $scope.totalVotes = 0;
      for (var i = 0; i < $scope.options.length; i++) {
        $scope.totalVotes += $scope.options[i].numberOfVotes;
      }
      for (var i = 0; i < $scope.options.length; i++) {
         $scope.options[i].percentage = $scope.options[i].numberOfVotes / $scope.totalVotes * 100;
       }
    }
    
    $scope.sendItem = function sendItem() {
      console.log('Sending message:', $scope.inputText);
      socket.emit('send', $scope.inputText);
      $scope.inputText = '';
    };
    
    $scope.vote = function sendVote(option) {
      console.log("Send vote on " + option.name);
      if (!$scope.voted) {
        socket.emit('vote', option);
      }
    };
    
    socket.on('connect', function() {
        socket.emit('getoptions');
    });
    
    socket.on('hasvoted',  function(status) {
        $scope.voted = status;
        $scope.$apply();
    });
    
    socket.on('votedFor', function(option) {
      console.log("voted for " + option.name);
      giveVoteOnOption(option);
        $scope.$apply();
    });
    
    socket.on('voteItem', function (option) {
      $scope.options.push(option);
      calculatePercentage();
      console.log("Loaded vote item " + option.name);
      $scope.$apply();
    });
    
    socket.on('refresh', function(options) {
        console.log("refresh " + options);
        $scope.options = options;
        calculatePercentage();
        $scope.$apply();
    });
    
    socket.on('setOutput', function(text) {
       $scope.textArea =   text;
        $scope.$apply();
    });

  }
