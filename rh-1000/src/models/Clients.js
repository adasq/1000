var _ = require('underscore');

	var Clients = function() {
		var 
		that= this,
		clients = [];

		this.type = {
			PLAYER: 'ppl',
			TABLE: 'table'
		};
		this.getTotalClients = function() {
			return clients.length;
		};
		this.getClientBySocketId = function(socketId){
			return _.find(clients, function(client){
				return client.socketId === socketId;
			});
		};
		this.getClientById = function(id) {
			return _.find(clients, function(client){
				return client.id === id;
			});
		};
		this.reAuthorize = function(socketId){
			var unAuthorized =  _.find(clients, function(client){
				return client.isAuthorized === false;
			});
			if(unAuthorized){		
					unAuthorized.socketId = socketId;
					unAuthorized.isAuthorized = true;
			}else{
				//no more slots available for player!
				console.log('no more slots available')

			}			
		};
		this.addClient = function(socketId, connectionId) {
			clients.push({
				socketId: socketId,
				id: connectionId,
				isAuthorized: false
			});
		};
		this.removeClient = function(socketId) {
			var client= that.getClientBySocketId(socketId);
			if(client){
				client.isAuthorized = false;
			}
		};
		this.areClientsPrepared = function() {
			return (that.getTotalClients() === 5);
		};
		this.authorizePlayer = function(socketId, id, playerName) {
			var client = that.getClientById(id);
			client.name = playerName || client.name;
			client.socketId = socketId;
			client.type = that.type.PLAYER;
			client.isAuthorized = true;
		};
		this.authorizeTable = function() {
			var client = that.getClientById(id);
			client.type = that.type.TABLE;
			client.isAuthorized = true;
		};
		this.getTable = function() {
			var table = _.find(clients, function(client) {
				return client.type === that.type.TABLE;
			});
			return table || null;
		};
		this.toString= function() {
			console.log('-----------------------');
			_.each(clients, function(client) {
				console.log(JSON.stringify(client));
			});
			console.log('-----------------------');
			return clients;
		}
	};



	module.exports = Clients;
	
