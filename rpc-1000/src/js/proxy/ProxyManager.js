var SocketManager = require('./socketManager.js');
var _ = require('underscore');
var MessagesBuffer = require('./MessagesBuffer.js');





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
	this.msgBuffer = new MessagesBuffer();
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
		console.log('================ message RECEIVED', aid, msg);
		var messageTypeBehavior = {
			message: function(){
				that.onMessageMessage(aid, msg);
			},
			response: function(){
				that.onResponseMessage(aid, msg);
			}
		};
		var handleMethod = messageTypeBehavior[msg.header.type];
		if(handleMethod){
			handleMethod();
		}
	}	
};

this.gameOutputManager = gameOutputManager;
this.gameInputManager = gameInputManager;
(new ServerCommunicationManager(gameInputManager, gameOutputManager));
};


ProxyManager.prototype.onMessageMessage = function(aid, msg){
			var messageId = makeid(10);
			var messageSource = aid;
			var messageTarget = msg.header.target;
			this.msgBuffer.insert(messageSource, messageTarget, messageId);
			console.log(messageSource + " --> "+messageTarget);
			console.log(msg);
			this.gameOutputManager.send(messageTarget, {header: {source: messageSource, mid: messageId, type: 'message'}, data: msg.data })
};

ProxyManager.prototype.onResponseMessage = function(aid, msg){			
			var messageId = msg.header.mid;			
			var responseTarget = this.msgBuffer.getByMid(messageId); 
			console.log(responseTarget.source + " <-- "+aid);
			console.log(msg);
			this.gameOutputManager.send(responseTarget.source, {header: {mid: responseTarget.mid, type: 'response'}, data: msg.data })
};


module.exports = ProxyManager;