var
_ = require('underscore');

var SocketManager = function(server){
	var 
	that= this;
	this.getSocketById = function(id){
		return _.find(sockets, function(socket){
			return socket.client.id === id;
		});
	}
	sockets = [];
	

	this.io = require("socket.io").listen(server);
	this.io.sockets.on("connection", function (socket) {
		sockets.push(socket);
		socket.on('message', function(msg){
			that.onMessageCallback.apply(that, [socket.client.id, msg]);
		});
		socket.on('SYN-ACK', function(msg){
			that.onAuthorizeCallback.apply(that, [socket.client.id, msg]);
		});
		
		that.onConnectionCallaback.call(that, socket.client.id);

		socket.on('disconnect', function () {
			that.onDisconnectionCallaback.call(that, socket.client.id);
		 	sockets.splice(sockets.indexOf(socket), 1);
		});
	});

};
SocketManager.prototype.onAuthorizeCallback = function(){ console.log('onAuthorizeCallback'); };
SocketManager.prototype.onMessageCallback = function(){ console.log('onMessageCallback'); };
SocketManager.prototype.onConnectionCallaback = function(){ console.log('onConnectionCallaback'); };
SocketManager.prototype.onDisconnectionCallaback = function(){ console.log('onDisconnectionCallaback'); };

SocketManager.prototype.send= function(socketId, msg, obj){
		var socket = this.getSocketById(socketId);
		if(!socket){
			console.log('socket does not exists ;x');			
		}else{
			socket.emit(msg, obj);
		}		
};

SocketManager.prototype.onConnection = function(fn){
	SocketManager.prototype.onConnectionCallaback= fn; 
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