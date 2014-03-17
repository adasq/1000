//Battle.js
var Battle = function(currentRound) {

    this.initialCard = null;
    this.initialPlayer = null;

    this.winner = null;
    this.winningCard = null;
    this.battleCards = new CardSet([]);

    this.allCardsThrowed = function() {
        return (this.battleCards.getTotalCards() === 3);
    };

    this.toString = function() {
        var result = "Battle[wygrywa " + this.winner.playerName + " rzucajac karte : " + this.winningCard.toString() + "\nKartyNaStole: ";
        result += this.battleCards.toString() + " ";
        result += "\n]";
        return result;
    }

    this.couldCardBeThrown = function(card) {
        var owner = card.cardOwner;
        if (currentRound.state.currentPairColor &&
                card.equalsToColor(currentRound.state.currentPairColor))       {
            console.log("Rzuca do meldunku");
            return true;
        }
        if (owner.hasColor(this.initialCard.cardColor)) {
            console.log("ma kolor");
            if (!card.equalWithColor(this.initialCard)) {
                console.log("chce rzucic inny kolor");
                return false;
            } else {
                console.log("chce rzucic TEN SAM kolor");
                return true;
            }
        } else {
            console.log("nie ma do koloru wiec mozna rzucic");
            return true;
        }
    };

    this.handleFinishedBattle = function() {
        this.winner.addRoundWinCards(this.battleCards.getCards());
        currentRound.setTurn(this.winner);
    }

    this.throwCard = function(card) {
        var that=this, player = card.cardOwner, result = {error: 0, type: -1},
                currentPairColor = currentRound.state.getCurrentPairColor();
        
        var setWinner = function(){
             that.winner = player;
             that.winningCard = card;
        }
        
        if (!card) {
            console.log("user nie ma takiej karty");
            return {error: 1, type: BattleState.cardDoesNotExists};
        } 
        if (!currentRound.isPlayerTurn(player)) {
            console.log("nie twa kolej");
            return {error: 1, type: BattleState.notYourTurn};
        }

        if (!this.winner && !this.winningCard) {
            //initial throw!
            this.initialCard = card;
            this.initialPlayer = player;
            setWinner();


            if (card.isKingOrQueen()) {
                console.log("moze melduje");
                if (player.cardSet.hasPairWith(card)) {
                    console.log("jest MELDUNEK!");
                    currentRound.state.currentPairColor = card.cardColor;
                    player.winCardSet.addPair(card.cardColor);
                    result.type = BattleState.pairMade;
                } else {
                    console.log("brakuje do meldunku");
                }
            }
        } else {
            //battle throw! ====== 
            if (!this.couldCardBeThrown(card)) {
                return {error: 1, type: BattleState.wrongCardThrowed};
            }
            if (currentRound.state.isPairSetted()) {
                //jest kolor zameldowany  
                if (card.equalsToColor(currentPairColor)) {
                    //rzut do koloru meldunku-------------------------------------------------------                        
                    if (this.winningCard.equalsToColor(currentPairColor)) {
                        //karta lezaca jest z meldunku            
                        if (card.isGreaterThan(this.winningCard)) {
                            setWinner();
                        }
                        //karta lezaca jest z meldunku
                    } else {
                        //karta lezaca NIE jest z meldunku
                       setWinner();
                        //karta lezaca NIE jest z meldunku   
                    }
                    //rzut do koloru meldunku-------------------------------------------------------
                } else {
                    //nie rzucil koloru do meldunku-------------------------------------------------                      
                    if (this.winningCard.equalsToColor(currentPairColor)) {
                        //najlepsza karta z meldunku

                        //najlepsza karta z meldunku
                    } else {
                        //najlepsza karta NIE z meldunku              
                        if (card.equalWithColor(this.initialCard) &&
                                card.isGreaterThan(this.winningCard)) {
                            setWinner();
                        }
                        //najlepsza karta NIE z meldunku   
                    }
                    //nie rzucil koloru do meldunku-------------------------------------------------
                }
                //jest kolor zameldowany  
            } else {
                //brak koloru zameldowanego
                if (card.equalWithColor(this.initialCard)) {
                    //kolory z initem sie zgadzaja
                    if (card.equalWithColor(this.winningCard)) {
                        //kolor z drugim sie zgadza                
                        if (card.isGreaterThan(this.initialCard) &&
                                card.isGreaterThan(this.winningCard)) {
                            setWinner();
                        }
                    } else {
                        //kolor z drugim sie NIE zgadza
                        if (card.isGreaterThan(this.initialCard)) {
                          setWinner();
                        }
                    }
                } else {
                    //kolor z initem sie nie zgadza
                    //czyli jak nikt nie meldowal, a != init to spierdalaj.    
                }
                //brak koloru zameldowanego  
            }
        }//battle throw
        this.battleCards.addCard(card);
        player.removeCard(card);
        console.log(player.playerName + ": rzucona karte " + card.toString());
        return result;
    };


};
//----------------------------------------------------------
