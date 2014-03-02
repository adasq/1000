var Round = function(gameTable2){
	var gameTable = gameTable2;
	this.battles = []; 
	this.currentBattle = new Battle(gameTable);
        this.playerPoints = [];
        this.prikup = null;
	this.isRoundFinished = function(){
		return (this.battles.length === 2);
	};
	
	this.throwCardAsPlayer = function(cardId, playerId){
		return this.currentBattle.setCardAsPlayer(cardId, playerId);
	};
	this.isBattleFinished= function(){
		return this.currentBattle.allCardsThrowed();
	};
	
	this.initialNewBattle = function(){		
		this.currentBattle = new Battle(gameTable);
	};
	
	this.handleFinishedBattle= function(){
		this.currentBattle.handleFinishedBattle();
		this.battles.push(this.currentBattle);
	};
        
        this.setPrikup = function(prikup){
            this.prikup =prikup;
        }
        
        this.toString= function(){
            for(var i=0;i<this.playerPoints.length;++i){
                //this.playerPoints
                
            }
            
        };
	
};
