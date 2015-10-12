var LinearVote = module.exports = function() {
    console.log ("Created LinearVote");
    this.numberOfVotes = 0;
    this.name = "";
};

LinearVote.prototype.reset = function() {
      this.numberOfVotes = 0;
     
};

LinearVote.prototype.giveVote = function() {
     
      this.numberOfVotes++;
      console.log("Vote added for " + this.name + " Total nr of votes is now : " + this.numberOfVotes);
     
};

LinearVote.prototype.setDescription = function(description) {
      this.name = description ;
      console.log("Updated description to " + description);
};

    // setDescription:function(newDescription) {
    //   this.description = newDescription;
    // },
    // getInfo: function() {
    //   return this.description + ' has #' + this.numberOfVotes + ' votes';
    // }
    