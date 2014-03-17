var GameTable = function() {

    this.rounds = [];
    this.currentRound = null;
    this.players = new Players();


    this.initializeRound = function() {

        var cardFactory = new CardFactory();
        var pack = cardFactory.generatePack();
        pack.shuffle();
        var cardSets = pack.getCardSets();

        var playersCardSets = cardSets.players;
        var prickupCardSet = cardSets.prickup;

        this.players.addCardSets(playersCardSets);

        this.currentRound = new Round(this);
        this.currentRound.setPrikup(prickupCardSet);

    }


    this.getRealPoints = function(total) {

        var points = total % 10;
        total -= points;
        total += ((points >= 5) ? 10 : 0)

        return total;
    };
    this.printPointsTable = function() {
        _.each(this.players.getPlayers(), function(player) {
            console.log(player.playerName + " punktowal: ", player.pointsHistory, " razem: " + player.getPoints());
        });
    };
    this.handleFinishedRound = function() {

        var leader = this.currentRound.leader;
        var leaderTarget = this.currentRound.leaderTarget;
        var that = this;
        console.log(this.currentRound);
        _.each(this.players.getPlayers(), function(player) {

            var total = player.winCardSet.getTotalPoints();
            player.currentRoundPoints = total; 
            if (player === leader) {
                console.log(leader.playerName + "gral " + leaderTarget + ",ugral: " + leader.currentRoundPoints);
                leader.pointsHistory.push((leader.currentRoundPoints >= leaderTarget) ? leaderTarget : -leaderTarget);
            } else {
                console.log(player.playerName + " zdobyl " + total + " czyli " + that.getRealPoints(total));
                player.pointsHistory.push(that.getRealPoints(total));
            }
            player.prepareForNextRound();
            
        });

        this.printPointsTable();
        this.rounds.push(this.currentRound);
    };




    this.toString = function() {

        return this.players.toString();

    };





};