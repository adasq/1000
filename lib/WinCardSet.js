var WinCardSet = function(){

  var cards = []; 
  
  this.toString= function(){
	 var result = "WinCards[\n"
     for(var i=0;i<cards.length;++i){
		result+= cards[i]+"\n";
	 }
	 result+="]";
	 return result;
  };
  
  this.calculatePoints = function(){
	var total = 0;
	for(var i=0;i<cards.length;++i){ 
			total += Shape.getPointsByShapeId(cards[i].cardShape);
	}
	//console.log("na prawde to:"+ total);
      //var totalChange = (total%10);
	//total = (totalChange>5) ?  (total+10-totalChange) :  (total-totalChange) ;
	
	return total;
  };
  
 this.addCards= function(arrayOfCards){
	for(var i=0;i<arrayOfCards.length;++i){
		cards.push(arrayOfCards[i]);
	}
 };
  
};