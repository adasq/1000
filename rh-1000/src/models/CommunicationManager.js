
var _ = require('underscore'),
Clients = require('./Clients');
	
module.exports = function(socketManager) {


function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    return text;
}


var CommunicationManager = function(gameInputManager, gameOutputManager){
	var that= this;
	this.clients = new Clients();	

	gameOutputManager.sendToClient = function(id, msg){
		var client = that.clients.getClientById(id);
		that.send(client.socketId, 'message', msg);
	};
	gameOutputManager.sendToClientLobbyState = function(id){
		var client = that.clients.getClientById(id);
		that.send(client.socketId, 'message', that.clients.toString());
	};
	gameOutputManager.sendToTable = function(msg){
		var table = that.clients.getTable();
		if(table){
			that.send(table.socketId, 'message', msg);			
		}else{
			console.log('no table found');
		}
	};

//----------------------------------------
	this.onConnection(function(socketId){

		if(!that.clients.areClientsPrepared()){
			//not enought clients			
			var connectionId = makeid();
			that.clients.addClient(socketId, connectionId);
			that.send(socketId, 'ACK', {cid: connectionId});
			console.log('adding clietns');
		}else{
			//enought clients, so we try to reauthorize
			console.log('re-authorizing');
			that.clients.reAuthorize(socketId);			
		}
		that.clients.toString();
	});
//----------------------------------------
	this.onAuthorize(function(socketId, msg){
		console.log('onAuthorize', msg);
		var client = that.clients.getClientById(msg.cid);

		if(!client.isAuthorized){
			that.clients.authorizePlayer(socketId, client.id, msg.name);
			gameInputManager.onPlayerConnected(client.id);
		}		
		
		
		that.clients.toString();
	});
//----------------------------------------
	this.onDisconnection(function(socketId){
		that.clients.removeClient(socketId);	
		that.clients.toString();	
	});

	this.onMessage(function(socketId, msg){
			var client = that.clients.getClientBySocketId(socketId); 
			gameInputManager.onThrowCard(client.id, {cardId: 666});
	});
};


CommunicationManager.prototype = socketManager;

return CommunicationManager;
	
};
