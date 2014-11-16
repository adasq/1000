
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
		var client = that.clients.getClientByAid(id);
		that.send(client.aid, 'message', msg);
	};
	gameOutputManager.sendToClients = function(msg){
		_.each(that.clients.getClients(), function(clientAid) {
			that.send(clientAid, 'message', msg || 'clientAid '+clientAid);
		});		
	};	

	gameOutputManager.sendToClientLobbyState = function(aid){
		var client = that.clients.getClientByAid(aid);
		that.send(client.aid, 'message', that.clients.toString());
	};

	gameOutputManager.sendToTable = function(msg){
		var table = that.clients.getTable();
		if(table){
			that.send(table.aid, 'message', msg);			
		}else{
			console.log('no table found');
		}
	};

//----------------------------------------
	this.onReconnection(function(aid){
		console.log('onReconnection', aid);		
		that.clients.reConnect(aid);
		var client = that.clients.getClientByAid(aid);
		if(client.isAuthorized){
			gameInputManager.onPlayerReconnected(client.aid);
		}		
		that.clients.toString();
	});
	this.onConnection(function(aid){
		console.log('onConnection', aid);
		that.clients.addClient(aid);
		gameOutputManager.sendToClientLobbyState(aid);
		console.log('adding clietns');		
		that.clients.toString();
	});
//----------------------------------------
	this.onAuthorize(function(aid, msg){
		console.log(aid, 'onAuthorize', msg);
		var client = that.clients.getClientByAid(msg.aid);
		if(!client){
			return;
		}
		if(!client.isAuthorized){
			that.clients.authorizePlayer(aid, msg.name);			
		}
		gameInputManager.onPlayerConnected(client.aid);	
		//that.clients.deleteUnauthorizedByAid(aid);		
		that.clients.toString();
	});
//----------------------------------------
	this.onDisconnection(function(aid){
		that.clients.removeClient(aid);	
		that.clients.toString();	
	});

	this.onMessage(function(aid, msg){
			var client = that.clients.getClientBySocketId(socketId); 
			gameInputManager.onThrowCard(client.aid, {cardId: 666});
	});
};


CommunicationManager.prototype = socketManager;

return CommunicationManager;
	
};
