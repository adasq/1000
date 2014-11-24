var Player = function(name, playerLocation) {
    this.playerId = 0;
    this.playerName = name;
    this.playerLocation = playerLocation;
    this.boombs = 2;

    this.pointsHistory = [0];
    this.currentRoundPoints = 0;

    this.cardSet = null;
    this.winCardSet = new WinCardSet();


    this.prepareForNextRound = function() {
        this.winCardSet = new WinCardSet();
         this.cardSet = null;
        this.currentRoundPoints = 0;
    };
    this.getPoints = function() {
        return _.reduce(this.pointsHistory, function(x, y) {
            return x + y;
        });
    };


    this.getCards = function() {
        return this.cardSet.getCards();

    };

    this.setCardSet = function(cardSet) {
        cardSet.setOwner(this);
        this.cardSet = cardSet;
    };

    this.hasColor = function(color) {
        return this.cardSet.hasSpecificColor(color);
    };

    this.removeCard = function(card) {
        card.cardOwner = null;
        this.cardSet.removeCard(card);
    };

    this.addRoundWinCards = function(cards) {
        this.winCardSet.addCards(cards);
    };

    this.addCard = function(card) {
        card.cardOwner = this;
        this.cardSet.addCard(card);
    };

    this.addCards = function(cardSet) {
        _.each(cardSet.getCards(), this.addCard, this);
    };


    this.toString = function() {
        return "Player[name: " + this.playerName + ", points: " + this.getPoints() + " playerId:" + this.playerId + ", " + this.cardSet.toString() + "" + this.winCardSet.toString() + "]";
    };

};