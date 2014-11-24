
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
	this.clients = new Clients();	

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
	this.onAuthorize(function(aid, msg){
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
			var client = that.clients.getClientByAid(aid); 
			gameInputManager.onMessage(client.aid, msg);
	});
};


CommunicationManager.prototype = socketManager;

return CommunicationManager;
	
};
