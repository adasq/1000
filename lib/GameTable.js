var GameTable = function(){
  var playersArray = [];
  this.totalPlayers = 0;
  this.currentPlayer = null;
  this.rounds = [];
  this.currentRound = null;
  
  this.initNewRound = function(){
  
	var cardFactory = new CardFactory();
	var cardSet = cardFactory.generateCardSet();
	cardSet.shuffle();
	this.dealCards(cardSet);  
	this.currentRound = new Round(this);
  
  };
  
   this.handleFinishedRound= function(){
   	   for(var i=0;i<playersArray.length;++i){
			var total = playersArray[i].winCardSet.calculatePoints();
			total+=playersArray[i].calculatePairs();
                        playersArray[i].currentRoundPoints = total;
                        //this.currentRound.playerPoints[playersArray[i].playerName] = total;
                        console.log(playersArray[i].playerName +" zdobyl "+ total);
                        playersArray[i].calculateRoundStatistics();
                        playersArray[i].prepareForNextRound();
	   }           
           
           this.rounds.push(this.currentRound);
   };
  
  this.state = {
    currentPairColor: null
  };
  this.isPairSetted = function(){
     return (this.state.currentPairColor !== null);
  };
  this.getCurrentPairColor = function(){
     return (this.state.currentPairColor);
  };
  this.isPlayerTurn= function(player){
    return (player === this.currentPlayer);    
  };
  
  this.toString= function(){
   
   var result = "GameTablePlayers[\n"
     for(var i=0;i<playersArray.length;++i){
		result+= playersArray[i]+"\n";
	 }
	 result+="]";
	 return result;
  
  };
  
  //--------------------------------------
  this.setTurn= function(player){
     this.currentPlayer= player;
    
  };  
  this.changeTurn = function(){
    var currentPlayerId = this.currentPlayer.playerId;
    if( currentPlayerId === this.totalPlayers){
        this.currentPlayer = this.getPlayerById(1);
    }else{
       this.currentPlayer =  this.getPlayerById(currentPlayerId+1);
    }  
		console.log("teraz kolej "+ this.currentPlayer.playerName);
  }; 
  //--------------------------------------
  this.addPlayer= function(player){  
    this.totalPlayers++;
    player.playerId = this.totalPlayers;
    playersArray.push(player);   
    if(this.totalPlayers === 1){
      this.currentPlayer= player;     
    } 
  };
  
  this.getPlayerById= function(id){   
    return (playersArray.filter(function(x){
     return (x.playerId === id);   
    }))[0];    
  };
  //---------------------  
   this.dealCards = function(cardSet){
    var cardArray = cardSet.getCardsArray();
     var cardCount = 0;

     for(var i=0;i<this.totalPlayers;++i){
		var arrayOfCards = cardArray.slice(cardCount,cardCount+7);
		
		for(var j=0;j<arrayOfCards.length;++j){	
				arrayOfCards[j].setCardOwner(playersArray[i]);				 				
		}

		playersArray[i].roundCardSet = new RoundCardSet(arrayOfCards);

       cardCount+=7; 
     }
      //var musik = new RoundCardSet(cardArray.slice(21,24));       
   };
  //-----------------
   this.isGameFinished = function(){
    return (this.getWinner()?true:false) ;
  };
  
  this.getWinner = function(){
    return (playersArray.filter(function(x){
     return (x.points >= 1000);   
    }))[0];  
  }; 
  //---------------

};
//----------------------------------------------------------