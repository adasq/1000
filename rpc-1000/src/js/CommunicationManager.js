
var _ = require('underscore'),
Clients = require('./Clients.js');
	
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
	gameInputManager.clients = this.clients = new Clients();	

	gameOutputManager.send = function(id, msg){
		var client = that.clients.getClientByAid(id);
		that.send(client.aid, 'message', msg);
	};
//----------------------------------------
	this.onReconnection(function(aid){
		that.clients.reConnect(aid);
		var client = that.clients.getClientByAid(aid);
		if(client.isAuthorized){
			gameInputManager.onPlayerReconnected(client.aid);
		}
	});
	this.onConnection(function(aid){
		that.clients.addClient(aid); 
	});
//----------------------------------------
	this.onAuthorize(function(aid, data){
		console.log('onAuthorize::::', arguments)
		var client = that.clients.getClientByAid(aid);
		if(!client){
			return;
		}
		if(!client.isAuthorized){
			that.clients.authorizePlayer(aid, data);
			gameInputManager.onPlayerConnected(client.aid);				
		}
			
		that.clients.toString();
	});
//----------------------------------------
	this.onDisconnection(function(aid){
		that.clients.removeClient(aid);	
		that.clients.toString();
	});

	this.onMessage(function(aid, msg){ 
			var client = that.clients.getClientByAid(aid); 
			gameInputManager.onMessage(client.aid, msg);
	});
};


CommunicationManager.prototype = socketManager;

return CommunicationManager;
	
};
