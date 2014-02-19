var Round = function(gameTable2){
	var gameTable = gameTable2;
	this.battles = [];
	this.currentBattle = new Battle(gameTable);

	this.isRoundFinished = function(){
		return (this.battles.length === 1);
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
	
	this.calculateBattleResult= function(){
		this.currentBattle.calculateBattleResult();
		this.battles.push(this.currentBattle);
	};
	
};
