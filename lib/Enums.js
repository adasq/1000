//----------------------------------------------------------
var Shape = {
Ace: 0,//11 points
Ten: 1,//10 points
King: 2,//4 points
Queen: 3,//3 points
Jack: 4,//2 points
Nine: 5,//0 points
   getNameByShapeId: function(shapeId){
    var result= -1;
    switch(shapeId){
      case 0:
        result = "A";
        break;
      case 1:
        result = "10";
        break;       
      case 2:
        result = "K";
        break;
       case 3:
        result = "Q";
        break;    
    case 4:
        result = "J";
        break;    
    case 5:
        result = "9";
        break;      
    }
        return result;        
  }, 
    getPointsByShapeId: function(shapeId){
    var result= 0;
    switch(shapeId){
      case 0:
        result = 11;
        break;
      case 1:
        result = 10;
        break;       
      case 2:
        result = 4;
        break;
       case 3:
        result = 3;
        break;    
    case 4:
        result = 2;
        break;    
    case 5:
        result = 0;
        break;      
    }
        return result;        
  }
  };
//----------------------------------------------------------
var Color = {
  Hearts: 0,//serce	100 points
  Diamonds: 1,//dzwonek	80 points
  Clubs: 2,//zoladz	60 points
  Spades: 3,//wino	40 points
  getNameByColorId: function(colorId){
    var result= -1;
    switch(colorId){
      case 0:
        result = "serce";
        break;
      case 1:
        result = "dzwonek";
        break;       
      case 2:
        result = "zoladz";
        break;
       case 3:
        result = "wino";
        break;      
    }       
        return result;       
  },
    getPointsByColorId: function(colorId){
    var result= 0;
    switch(colorId){
      case 0:
        result = 100;
        break;
      case 1:
        result = 80;
        break;       
      case 2:
        result = 60;
        break;
       case 3:
        result = 40;
        break;      
    }       
        return result;       
  }
};
//----------------------------------------------------------
var BattleState = {
	notYourTurn:0,
	playerDoesNotExists:1,
	cardDoesNotExists:2,
	pairMade:3,
	wrongCardThrowed:4,
	getMessageByBattleState: function(state){
    var result= -1;
    switch(state){
      case 0:
        result = "Nie Twoja kolej!";
        break;
      case 1:
        result = "Taki gracz nie istnieje!";
        break;       
      case 2:
        result = "Nie posiadasz takiej karty!";
        break;
       case 3:
        result = "Zameldowano";
        break; 
       case 4:
        result = "wrongCardThrowed";
        break; 		
		default:
		result="~~";
		break;
    }
        
        return result;
        
  }
};
//----------------------------------------------------------
var show= function(zzz){
  for(var i=0;i<zzz.length;++i){
        console.log(zzz[i].toString());
 } 
};