#!/bin/env node
var
q = require('q'),
_ = require('underscore'),
fs = require('fs'),
Server = require('./Server'),
config = require('../config');


var server = new Server();
server.init(function(){
console.log("----------------------------------------------------------------------");

	
var CommunicationManager = require('./models/CommunicationManager.js')(server.socketManager);


//-----------------------------------------------------

var gameOutputManager = {
	sendToClient: function(id, msg){},
	sendToClients: function(msg){}
};

var gameInputManager = {
	
	onPlayerReconnected: function(aid){
		console.log('!!!!!!!!!!onPlayerREconnected ', aid);
		gameOutputManager.sendToClientLobbyState(aid);
	},	
	onPlayerConnected: function(aid){
		console.log('!!!!!!!!!!onPlayerConnected ', aid);
		gameOutputManager.sendToClientLobbyState(aid);
	},
	onTableConnected: function(){
		console.log('onTableConnected');
	},
	onThrowCard: function(id, msg){
		gameOutputManager.sendToClient(id, msg);
	}
};
setInterval(function() {
	gameOutputManager.sendToClients();
}, 5000);

(new CommunicationManager(gameInputManager, gameOutputManager));





});



