var Players = function(){
    
    var players = [];
    
  this.addPlayer= function(player){       
    player.playerId = this.getTotalPlayers();
    players.push(player);   
  };
  
  this.addCardSets = function(arrayOfCardSets){
      _.each(players, function(player){         
             player.setCardSet(arrayOfCardSets.shift());          
      });
    
      
  };
  this.getPlayers= function(){
      return players;
  }
  this.getNextPlayerByPrevious= function(player){
      return this.getPlayerById(     (player.playerId === 2)?0:(player.playerId+1)    );    
  };
  this.getTotalPlayers = function(){
      return players.length;
  };
  
  this.getPlayerById= function(id){          
     return  _.find(players, function(player){
          return (player.playerId === id);
      });
  };
  
  this.getWinner = function(){    
      return  _.find(players, function(player){ 
           return (player.getPoints() >= 1000);
      });
  }
  
  this.isWinner = function(){
      return (this.getWinner())?true:false;
  }
  
  this.toString = function(){
     return _.reduce(players, function(player1, player2){        
          return player1.toString()+"\r\n"+player2.toString();
      });
  }
  
};