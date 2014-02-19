var PointsManager = function(){
  var gatheredCardSet= [];
  var pairs = [];
  this.points = 0;
  
  this.addGatheredCard= function(card){
    gatheredCardSet.push(card);
  };
  this.addPair= function(pair){
      pairs.push(pair);
  };
  
  this.calculatePoints= function(){
    var total =0;
	//meldunki
	if(pairs.length > 0){
		for(var i=0;i<pairs.length;++i){
			total += Color.getPointsByColorId(pairs[i]);
		}	
	}
	//punkty:
	for(var i=0;i<gatheredCardSet.length;++i){ 
			total += Shape.getPointsByShapeId(gatheredCardSet[i].cardShape);
	}
	this.points += total;
	return total;
  };
  
};