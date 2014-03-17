
var assert = buster.assert;

buster.testCase("Date strftime tests", {
    /*
     setUp: function () {
     this.date = new Date(2010, 11, 5);
     },
     
     "%Y": {
     setUp: function () {
     this.year = strftime(this.date, "%Y");
     },
     
     "should return full year": function () {
     assert.equals(this.year, "2009");
     },
     
     "should return a string": function () {
     assert.equals(typeof this.year, "string");
     }
     },
     
     "%y should return two digit year": function () {
     assert.equals(strftime(this.date, "%y"), "09");
     },
     
     "%m should return month": function () {
     assert.equals(strftime(this.date, "%m"), "12");
     },
     
     "%d should return date": function () {
     assert.equals(strftime(this.date, "%d"), "05");
     },
     */
    "dodawanie 2+2 ": function() {

        var gameTable = new GameTable();
        gameTable.players.addPlayer(new Player("adam", PlayerPossition.BOTTOM));
        gameTable.players.addPlayer(new Player("andrzej", PlayerPossition.LEFT));
        gameTable.players.addPlayer(new Player("xxx", PlayerPossition.RIGHT));


        gameTable.initializeRound();        
        
        
        var adam = gameTable.players.getPlayerById(0); 
        var andrzej = gameTable.players.getPlayerById(1); 
        var xxx = gameTable.players.getPlayerById(2); 
        
        gameTable.currentRound.setLeaderAndTarget(andrzej, 200);
        console.log(gameTable.currentRound.isPlayerTurn(andrzej));
        gameTable.currentRound.changeTurn();
        gameTable.currentRound.changeTurn();
        
        
       var prickup = gameTable.currentRound.getPrikup();
       andrzej.addCards(prickup);
        
        var card1 = andrzej.getCards()[0];
        var card2 = andrzej.getCards()[0];
        andrzej.removeCard(card1); 
        andrzej.removeCard(card2); 
        adam.addCard(card1); 
        xxx.addCard(card2); 
          
        console.log(gameTable.toString())

        assert.equals(gameTable.players.getTotalPlayers(), 3);
    }
});
