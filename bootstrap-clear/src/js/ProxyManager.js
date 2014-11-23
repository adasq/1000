var SocketManager = require('./socketManager.js');

var ProxyManager = function(server) {
	var socketManager = new SocketManager(server);
	var CommunicationManager = require('./CommunicationManager.js')(socketManager);

var gameOutputManager = {
	send: function(aid, msg){}
};

var gameInputManager = {	
	onPlayerReconnected: function(aid){
		console.log('!!!!!!!!!! onPlayerREconnected ', aid);		
	},	
	onPlayerConnected: function(aid){
		console.log('!!!!!!!!!! onPlayerConnected ', aid);
	},
	onMessage: function(aid, msg) {
		console.log('!!!!!!!!!! onMessage ', aid, msg);
		gameOutputManager.send(aid, {response: 'yarly'})
	}	
};

(new CommunicationManager(gameInputManager, gameOutputManager));

};

module.exports = ProxyManager;