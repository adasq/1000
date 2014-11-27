var SocketManager = require('./socketManager.js');
var _ = require('underscore');

var ProxyManager = function(server) {
	this.responseQueue = [];
	var that=this;

	var socketManager = new SocketManager(server);
	var CommunicationManager = require('./CommunicationManager.js')(socketManager);

var gameOutputManager = {
	send: function(aid, msg){}
};

var gameInputManager = {	
	onPlayerReconnected: function(aid){
		console.log('!!!!!!!!!! onPlayerReconnected ', aid);	 
		var clients = this.clients.getClients();
		_.each(clients, function(client){
			gameOutputManager.send(client.aid, {type: 'clients', data: clients })
		});	
	},	
	onPlayerConnected: function(aid){
		console.log('!!!!!!!!!! onPlayerConnected ', aid);
	},
	onMessage: function(aid, msg) {
		console.log('!!!!!!!!!! onMessage ', aid, msg);		
		if(msg.type && msg.type === 'message'){
			that.responseQueue.push({
				source: aid,
				target: msg.target
			});
			gameOutputManager.send(msg.target, {type: 'message', data: msg.data })
		}else if(msg.type && msg.type === 'response'){
			var responseTarget = that.responseQueue[0].source; 
			gameOutputManager.send(responseTarget, {type: 'response', data: msg.data })
		}else{
			gameOutputManager.send(aid, {type: 'response', data: {r: 'ly'} })
		}

			
	}	
};

(new CommunicationManager(gameInputManager, gameOutputManager));




};

module.exports = ProxyManager;