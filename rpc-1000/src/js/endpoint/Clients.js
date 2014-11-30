var _ = require('underscore');

var Clients = function(){
	var clients = [];
	this.set = function(clientsX){
		clients = clientsX;
	};
	this.get= function(){
		return clients;
	}
	this.getClientByType = function(type){
		return _.find(clients, function(client){
			return client.type.toLowerCase() === type.toLowerCase();
		});
	};
	this.getClientByNameAndType = function(name, type){
		return _.find(clients, function(client){
			return (client.type.toLowerCase() === type.toLowerCase() && client.name.toLowerCase() === name.toLowerCase());
		});
	};	
};
module.exports = Clients;