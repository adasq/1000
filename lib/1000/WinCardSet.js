var WinCardSet = function() {

    var cards = [];
    var pairs = [];
    this.toString = function() {
        var result = "WinCards[\n"
        for (var i = 0; i < cards.length; ++i) {
            result += cards[i] + "\n";
        }        
        result += "]";
        return result;
    };
    
    this.addPair = function(cardColor){
        pairs.push(cardColor);
    }
    
    this.calculatePairs = function() {
        var total = 0;
        if (pairs.length > 0) {            
            _.each(pairs, function(colorId){
                total += Color.getPointsByColorId(colorId);
            });
        } 
        return total;
    };
    
    this.calculatePoints = function() {
        var total = 0; 
         _.each(cards, function(card){
               total += Shape.getPointsByShapeId(card.cardShape);
            });
        return total;
    };
    
    this.getTotalPoints = function(){
        return (this.calculatePoints()+this.calculatePairs());
    };

    this.addCards = function(arrayOfCards) {      
           _.each(arrayOfCards, function(card){
              cards.push(card);
            });
    };

};