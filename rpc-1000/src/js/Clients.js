var _ = require('underscore');

	var Clients = function() {
		var 
		that= this,
		clients = [];

		this.type = {
			PLAYER: 'ppl',
			TABLE: 'table'
		};
		this.getClients = function() {
			return _.pluck(clients, 'aid');
		}
		this.getTotalClients = function() {
			return clients.length;
		};
		this.getClientByAid = function(aid){
			return _.find(clients, function(client){
				return client.aid === aid;
			});
		};		
		this.reConnect = function(aid) {
			var client = that.getClientByAid(aid);
			client.isConnected = true;
		};
		this.getClients = function(){
			return clients;
		};
		this.reAuthorize = function(aid){
			var unAuthorized =  _.find(clients, function(client){
				return client.isAuthorized === false;
			});
			if(unAuthorized){
					unAuthorized.aid = aid;
					unAuthorized.isAuthorized = true;					
			}else{
				//no more slots available for player!
				console.log('no more slots available');
			}			
		};
		this.addClient = function(aid) {
			clients.push({
				aid: aid, 
				isAuthorized: false,
				isConnected: true
			});
		};
		this.deleteByAid = function(aid) {
			_.each(clients, function(client, i){
				if(client.aid === aid){
					clients.splice(i, 1);
				}
			});
		};
		this.deleteUnauthorizedByAid = function(aid) {
			_.each(clients, function(client, i){
				if(client.aid === aid && client.isAuthorized === false){
					clients.splice(i, 1);
				}
			});
		};
		this.removeClient = function(aid) {
			var client= that.getClientByAid(aid);
			if(client){
				client.isConnected = false;
			}
		};		
		this.authorizePlayer = function(aid, data) {
			var client = that.getClientByAid(aid);
			client.name = data.name || client.name;
			client.type = data.type || 'DEFAULT';
			client.isAuthorized = true;
		};
		this.authorizeTable = function() {
		

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
	
