var RoundCardSet = function(cardsArray){

  var cards = cardsArray; 
  
  this.toString= function(){
	 var result = "RoundCards[\n"
     for(var i=0;i<cards.length;++i){
		result+= cards[i]+"\n";
	 }
	 result+="]";
	 return result;
  };
  this.getCardById=function(id){
	
     var card = (cards.filter(function(x){   
     return (x.cardId === id);   
    }));   
	card = card && card[0];	
    return card;
  };
  
  this.getCards = function(){
  return cards;
  };
  
  this.removeCard= function(card){
  
	  for(var i=0;i<cards.length;++i){
		if(card.cardId === cards[i].cardId){
			cards.splice(i,1);
			return;
		}
	  }
  
  };
  
  this.hasSpecificColor = function(color){
	 return cards.some(function (x){   
		return (x.cardColor === color);
	 });
  }
  
  this.hasPairWith= function(card){
        
    var pairShape = (card.cardShape === Shape.King)?Shape.Queen:Shape.King;
    var pairColor = card.cardColor;

   return cards.some(function (x){   
     return (x.cardShape == pairShape && x.cardColor === pairColor);
   });
    
  };
  
};