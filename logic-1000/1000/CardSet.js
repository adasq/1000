var CardSet = function(cards) {

   var genRandomByRange = function(start, end) {
        return Math.floor(Math.random() * end + start);
    };
    
    this.toString = function() {
        var cardSet = _.reduce(cards, function(card1, card2) {
            return card1 + "!" + card2;
        });
        return "CardSet[" + cardSet + "]";
    };
    this.getCardById = function(id) {
        return _.find(cards, function(card) { return (card.cardId === id);  });
    };
    this.addCard = function(card) {
        cards.push(card);
    };
    this.setOwner = function(owner) {
        _.each(cards, function(card) {card.cardOwner = owner; });
    };
    this.getCards = function() {
        return cards;
    };
    this.getTotalCards = function(){
         return cards.length;
    };
    this.removeCard = function(cardToDelete) {
        _.find(cards, function(card, i) {
            if (cardToDelete === card) {
                cards.splice(i, 1);
                return true;
            }
        });
    };

    this.shuffle = function() {
        var cardsLength = cards.length, randomIndex, shuffledCards = [];
        do {
            randomIndex = genRandomByRange(0, cardsLength);
            shuffledCards.push(cards.splice(randomIndex, 1)[0]);
            cardsLength = --cardsLength;
        } while (cardsLength > 0);
        cards = shuffledCards;
    };//shuffle

    this.hasSpecificColor = function(color) {
        return cards.some(function(card) {
            return (card.cardColor === color);
        });
    };

    this.hasPairWith = function(card) {
        var pairColor = card.cardColor, pairShape = (card.cardShape === Shape.King) ? Shape.Queen : Shape.King;
        return cards.some(function(card) {
            return (card.cardShape === pairShape && card.cardColor === pairColor);
        });

    };

};
 