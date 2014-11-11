
var _ = require('underscore'),
Clients = require('./Clients');
	
module.exports = function(socketManager) {

var CommunicationManager = function(gameInputManager, gameOutputManager){
	var that= this;
	this.clients = new Clients();	

	gameOutputManager.sendToClient = function(id, msg){
		var client = that.clients.getClientById(id);
		that.send(client.socketId, 'message', msg);
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
			that.clients.addClient(socketId);
			that.send(socketId, 'ACK', {});
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
		var client = that.clients.getClientBySocketId(socketId);
		console.log(msg.name);
		if(msg.name){			
			that.clients.authorizePlayer(client.id, msg.name);
			gameInputManager.onPlayerConnected(msg.name);
		}else{
			that.clients.authorizeTable(client.id);
			gameInputManager.onTableConnected();
		}
		that.clients.toString();
	});
//----------------------------------------
	this.onDisconnection(function(socketId){
		that.clients.removeClient(socketId);		
	});

	this.onMessage(function(socketId, msg){
			var client = that.clients.getClientBySocketId(socketId); 
			gameInputManager.onThrowCard(client.id, {cardId: 666});
	});
};


CommunicationManager.prototype = socketManager;

return CommunicationManager;
	
};
