var Card = function(id, color, shape){
  this.cardId= id;
  this.cardColor =  color;
  this.cardShape =  shape;
   this.cardOwner = null;
   
  this.isKingOrQueen = function(){
    return (this.cardShape === Shape.Queen || this.cardShape ===   Shape.King);    
  };  
  
  this.isGreaterThan = function(card){   
    return (this.cardShape < card.cardShape);   
  };
  
  this.equalWithColor= function(card){
    return (card.cardColor === this.cardColor);
  };
  
  
  this.equalsToColor = function(cardColor){   
    return (cardColor === this.cardColor);  
  };
  
  this.setCardOwner = function(cardOwner){ 
   this.cardOwner =  cardOwner; 
  };
  this.toString = function(){ 	
	 return Shape.getNameByShapeId(this.cardShape)+" "+Color.getNameByColorId(this.cardColor);
  
  };
  
};
//----------------------------------------------------------