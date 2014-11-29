var SocketManager = require('./socketManager.js');
var _ = require('underscore');



var MessagesBuffer = function(){

	var buffer = [];

	this.push= function(source, target){
		buffer.push({
			source: source,
			target: target,
			time: +new Date()
		});
	};

	//this.get


};

function makeid(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < (length || 5); i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    return text;
}


var ProxyManager = function(server) {
	this.responseQueue = [];
	var that=this;

	var socketManager = new SocketManager(server);
	var ServerCommunicationManager = require('./ServerCommunicationManager.js')(socketManager);



var gameOutputManager = {
	send: function(aid, msg){}
};
var gameInputManager = {
	sendClients: function(){
		var clients = this.clients.getClients();
		_.each(clients, function(client){
			gameOutputManager.send(client.aid, {header: {type: 'clients'}, data: clients })
		});	
	},
	onPlayerReconnected: function(aid){
		console.log('!!!!!!!!!! onPlayerReconnected ', aid);	 
		this.sendClients();
	},	
	onPlayerConnected: function(aid){
		console.log('!!!!!!!!!! onPlayerConnected ', aid);
		this.sendClients();
	},
	onDisconnection: function(aid){
		console.log('!!!!!!!!!! onDisconnection ', aid);
		this.sendClients();
	},	
	onMessage: function(aid, msg) {
		console.log('!!!!!!!!!! onMessage ', aid, msg);

		if(msg.header.type && msg.header.type === 'message'){
			var mid = makeid(10);
			var message = {
				source: aid,
				target: msg.header.target,
				mid: mid
			};
			that.responseQueue.push(message);
			console.log('pushing to queue', message);
			gameOutputManager.send(msg.header.target, {header: {mid: mid, type: 'message'}, data: msg.data })
		}else if(msg.header.type && msg.header.type === 'response'){

			var messageId = msg.header.mid;
			
			var responseTarget = that.responseQueue[0]; 
			console.log('response', msg.header.mid, that.responseQueue);
			gameOutputManager.send(responseTarget.source, {header: {mid: responseTarget.mid, type: 'response'}, data: msg.data })
		}else{
			gameOutputManager.send(aid, {header: {mid: mid, type: 'response'}, data: {r: 'ly'} })
		}			
	}	
};

(new ServerCommunicationManager(gameInputManager, gameOutputManager));




};

module.exports = ProxyManager;