var Player = function(name, playerLocation){
  this.playerId= -1;
  this.playerName = name;
  this.playerLocation = playerLocation;
  this.boombs = 2;  
  
  this.pointsManager= new PointsManager();
  this.totalPoints = 0;
  this.currentRoundPoints = 0;
  this.pairs = [];
  this.roundCardSet= null;
  this.winCardSet= new WinCardSet();

  this.calculateRoundStatistics = function(){
      this.totalPoints += this.currentRoundPoints;
      this.currentRoundPoints= 0;
  };
  
  this.prepareForNextRound= function(){
      this.winCardSet= new WinCardSet();
  };

  this.calculatePairs  = function(){
	var total = 0;
	if(this.pairs.length > 0){
		for(var i=0;i<this.pairs.length;++i){
			total += Color.getPointsByColorId(this.pairs[i]);
		}			
	}
	return total;
  };
  
  
  this.hasColor = function(color){  
	return this.roundCardSet.hasSpecificColor(color);
  };
  
  this.removeCard = function(card){  
	this.roundCardSet.removeCard(card); 
  };  
  
  this.addRoundWinCards = function(cards){
	 this.winCardSet.addCards(cards);
  }

  this.toString= function(){
    return "Player[name: "+this.playerName+", points: "+this.totalPoints+" playerId:"+this.playerId+", "+this.roundCardSet.toString()+""+this.winCardSet.toString()+"]";
  };
  
};