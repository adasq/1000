var CardSet = function(cardArray){
  
  var cards = cardArray; 	 
		 
  this.toString= function(){
    var result="";
      for(var i=0;i<cards.length;++i){
        result+=cards[i].toString()+"\n";
     }   
    return result;
  }; 
  var genRandomByRange=  function(start, end){
     return Math.floor(Math.random()*end+start);
  };

  this.shuffle=  function(){
    var cardsLength = cards.length, randomIndex, shuffledCards = [];     
    do{ 
        randomIndex = genRandomByRange(0, cardsLength);
        shuffledCards.push(cards.splice(randomIndex,1)[0]);
        cardsLength = cards.length;    
    }while(cardsLength > 0);   
  cards= shuffledCards;

  };//shuffle
  this.getCardsArray= function(){
    return cards;
    
  };  
  
};