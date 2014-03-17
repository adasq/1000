var Round = function(gameTable) {
    this.battles = [];
    this.currentBattle = new Battle(this);
    this.currentPlayer = null;
    this.prikup = null;
    this.leader = null;
    this.leaderTarget = 0;

    this.state = {
        currentPairColor: null,
        isPairSetted: function() {
            return (this.currentPairColor !== null);
        },
        getCurrentPairColor: function() {
            return (this.currentPairColor);
        }
    };

    this.isRoundFinished = function() {
        return (this.battles.length === 1);
    };

    this.throwCard = function(card) {
        return this.currentBattle.throwCard(card);
    };
    this.isBattleFinished = function() {
        return this.currentBattle.allCardsThrowed();
    };

    this.initialNewBattle = function() {
        this.currentBattle = new Battle(this);
    };
            
    this.handleFinishedBattle = function() {
        this.currentBattle.handleFinishedBattle();
        this.battles.push(this.currentBattle);
        console.log(this.currentBattle.toString());
    };
    this.setLeaderAndTarget = function(leader, target) {
        this.leader = leader;
        this.leaderTarget = target;
        this.setTurn(leader);
    };
    this.setPrikup = function(prikup) {
        this.prikup = prikup;
    };
    this.getPrikup = function() {
       return this.prikup;
    };

    this.toString = function() {

    };
    
    this.setTurn = function(player) {
        this.currentPlayer = player;
    };
    this.isPlayerTurn = function(player) {
        return (player === this.currentPlayer);
    };
    
    this.changeTurn = function() {    
        this.setTurn(gameTable.players.getNextPlayerByPrevious(this.currentPlayer));     
        console.log("teraz kolej " + this.currentPlayer.playerName);
    };


};
