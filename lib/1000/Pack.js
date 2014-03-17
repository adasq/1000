var Pack = function(cards) {

    this.toString = function() {
        var result= _.reduce(cards, function(card1, card2){
            return  card1 + " "+ card2;
        });        
        return "CardSet[\n" +result+ "]";         
    };

    var genRandomByRange = function(start, end) {
        return Math.floor(Math.random() * end + start);
    };
    this.isFullSet = function() {
        return (this.getTotalCards() === 24);
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
    this.getTotalCards = function() {
        return cards.length;
    };
    this.getCardSets = function() {

        if (!this.isFullSet())
            return null;
        
        var cardSets = {
            prickup: null,
            players: []
        };
        cardSets.players.push(new CardSet(cards.splice(0, 7)));
        cardSets.players.push(new CardSet(cards.splice(0, 7)));
        cardSets.players.push(new CardSet(cards.splice(0, 7)));
        cardSets.prickup = (new CardSet(cards.splice(0, 3)));

        return cardSets;

    };



};
 