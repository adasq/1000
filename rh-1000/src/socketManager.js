var
_ = require('underscore');

var SocketManager = function(server){
	var 
	that= this,
	clients = [];	

	this.getClientByAid = function(aid){
		return _.find(clients, function(client){
			return client.aid === aid;
		});
	};
	this.io = require("socket.io").listen(server);
	this.io.sockets.on("connection", function (socket) {
		var socketId= socket.client.id;
		socket.emit('ACK', {});
		socket.on('CONNECT', function(msg) {
			var authorizeId = msg.aid;
			var client = that.getClientByAid(authorizeId);
			if(client){
				//client is already registered, so update data
				client.socket = socket;
				client.isConnected=true,
				that.onReconnectionCallaback.call(that, authorizeId);
			}else{
				//no client registered!
				clients.push({
					isConnected: true,
					socket: socket,
					aid: authorizeId
				});
				that.onConnectionCallaback.call(that, authorizeId);
			}
			socket.on('message', function(msg){
				that.onMessageCallback.apply(that, [authorizeId, msg]);
			});

			socket.on('AUTHORIZE', function(msg){
				that.onAuthorizeCallback.apply(that, [authorizeId, msg]);
			});

			socket.on('disconnect', function () {
				that.onDisconnectionCallaback.call(that, authorizeId);
				var client= that.getClientByAid(authorizeId);
				client.isConnected = false;
			});
		});//authorize
	});
};
SocketManager.prototype.onAuthorizeCallback = function(){ console.log('onAuthorizeCallback'); };
SocketManager.prototype.onMessageCallback = function(){ console.log('onMessageCallback'); };
SocketManager.prototype.onConnectionCallaback = function(){ console.log('onConnectionCallaback'); };
SocketManager.prototype.onReconnectionCallaback = function(){ console.log('onReconnectionCallaback'); };
SocketManager.prototype.onDisconnectionCallaback = function(){ console.log('onDisconnectionCallaback'); };

SocketManager.prototype.send= function(aid, msg, obj){
	console.log('try to send to '+aid)
		var client = this.getClientByAid(aid);
		if(!client){
			console.log('socket does not exists ;x');			
		}else{
			client.socket.emit(msg, obj);
		}		
};

SocketManager.prototype.onConnection = function(fn){
	SocketManager.prototype.onConnectionCallaback= fn; 
};
SocketManager.prototype.onReconnection = function(fn){
	SocketManager.prototype.onReconnectionCallaback= fn; 
};

SocketManager.prototype.onAuthorize = function(fn){
	SocketManager.prototype.onAuthorizeCallback= fn; 
};

SocketManager.prototype.onMessage = function(fn){
	SocketManager.prototype.onMessageCallback= fn; 
};

SocketManager.prototype.onDisconnection = function(fn){
	SocketManager.prototype.onDisconnectionCallaback= fn;
};

module.exports = SocketManager;