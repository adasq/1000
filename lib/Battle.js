//Battle.js
var Battle = function(gameTable2){
  var gameTable=gameTable2;
  
  this.initialCard = null;
  this.initialPlayer = null;
  
  this.winner= null;
  this.winningCard= null; 
  this.battleCards = [];
  
  this.allCardsThrowed = function(){ 
	return ( this.battleCards.length === 3); 
  };
  
  this.toString = function(){
		var result = "Battle[wygrywa "+this.winner.playerName+" rzucajac karte : "+this.winningCard.toString()+"\nKartyNaStole: ";
	  for(var i=0;i<this.battleCards.length;++i){
			result += this.battleCards[i].toString()+" ";
	  }
	  result+="\n]";
		return result;
  }
    
  this.couldCardBeThrown = function(card){
  
	var owner = card.cardOwner;
	

	if(gameTable.state.currentPairColor && 
	card.equalsToColor(gameTable.state.currentPairColor))
		{
				console.log("Rzuca do meldunku");
				return true;
		}

		if(owner.hasColor(this.initialCard.cardColor)){
			console.log("ma kolor");
			
			if(!card.equalWithColor(this.initialCard)){
				console.log("chce rzucic inny kolor");
				return false;
			}else{
				console.log("chce rzucic TEN SAM kolor");
				return true;
			}
			
			
		}else{
			console.log("nie ma do koloru wiec mozna rzucic");
			return true;
		}	
	
  };
  
  this.handleFinishedBattle = function(){
	this.winner.addRoundWinCards(this.battleCards);
	gameTable.setTurn(this.winner);
  }
  
  this.setCardAsPlayer= function(cardId, playerId){
  
    var player,card, result = {error: 0, type: -1};
    player= gameTable.getPlayerById(playerId);
    
    if(!player){
       console.log("player nie istnieje"); 
       return {error: 1, type: BattleState.playerDoesNotExists};	      
    }

    card = player.roundCardSet.getCardById(cardId);
   
    if(!card){
       console.log("user nie ma takiej karty"); 
	    return {error: 1, type: BattleState.cardDoesNotExists};
    }
    
    if(!gameTable.isPlayerTurn(player)){    
       console.log("nie twa kolej"); 
	    return {error: 1, type: BattleState.notYourTurn};

    }

       if(!this.winner &&  !this.winningCard){
        //initial throw!
       this.initialCard = card;
       this.initialPlayer = player;
       this.winner= player;
       this.winningCard= card;
        
         
       if(card.isKingOrQueen()){
        console.log("moze melduje");
        
        if(player.roundCardSet.hasPairWith(card)){
              console.log("!!!!!!!!!!!!!!!!!!!!!!! jest meldunek!");
                gameTable.state.currentPairColor = card.cardColor;
                player.pointsManager.addPair(card.cardColor);
				 player.pairs.push(card.cardColor);
				result.type = BattleState.pairMade;
        }else{
         console.log("brakuje do meldunku"); 
        }
         
      }

       }else{
        //battle throw! ====== 
		
		if(!this.couldCardBeThrown(card)){
			return {error: 1, type: BattleState.wrongCardThrowed};	
		}  
	
	
         if(gameTable.isPairSetted()){
         //jest kolor zameldowany  
           
           if(card.equalsToColor(gameTable.getCurrentPairColor())){
           //rzut do koloru meldunku-------------------------------------------------------                        
             if(this.winningCard.equalsToColor(gameTable.getCurrentPairColor())){
             //karta lezaca jest z meldunku            
               if(card.isGreaterThan( this.winningCard)){
                    this.winner= player;
                     this.winningCard= card;
               }
              //karta lezaca jest z meldunku
              }else{
              //karta lezaca NIE jest z meldunku
                 this.winner= player;
                 this.winningCard= card;
              //karta lezaca NIE jest z meldunku   
              }  
           //rzut do koloru meldunku-------------------------------------------------------
           }else{
           //nie rzucil koloru do meldunku-------------------------------------------------                      
             if(this.winningCard.equalsToColor(gameTable.getCurrentPairColor())){
             //najlepsza karta z meldunku
              
             //najlepsza karta z meldunku
             }else{
             //najlepsza karta NIE z meldunku              
              if(card.equalWithColor(this.initialCard) &&
              card.isGreaterThan( this.winningCard)){
                    this.winner= player;
                    this.winningCard= card;
              }                              
             //najlepsza karta NIE z meldunku   
             }                       
           //nie rzucil koloru do meldunku-------------------------------------------------
           }
         //jest kolor zameldowany  
         }else{
         //brak koloru zameldowanego
           
           if(card.equalWithColor(this.initialCard)){
           //kolory z initem sie zgadzaja
                if(card.equalWithColor(this.winningCard)){
                  //kolor z drugim sie zgadza                
                   if(card.isGreaterThan(this.initialCard) &&
                     card.isGreaterThan(this.winningCard)){
                      this.winner= player;
                      this.winningCard= card;                     
                   }                                
                }else{
                   //kolor z drugim sie NIE zgadza
                  if(card.isGreaterThan(this.initialCard)){
                      this.winner= player;
                      this.winningCard= card;                 
                  }
                }
             
           }else{
           //kolor z initem sie nie zgadza
           //czyli jak nikt nie meldowal, a != init to spierdalaj.    
           }
           
         //brak koloru zameldowanego  
         }
    
       }//battle throw
      
      this.battleCards.push(card);
	  player.removeCard(card);

      console.log(player.playerName+": rzucona karte "+card.toString());
      //console.log( player.roundCardSet.toString());
	   return result;
  };
  
  
};
//----------------------------------------------------------
