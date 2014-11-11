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
	sendToClient: function(id, msg){}
};

var gameInputManager = {
	onPlayerConnected: function(pid){
		console.log('onPlayerConnected ', pid);
	},
	onTableConnected: function(){
		console.log('onTableConnected');
	},
	onThrowCard: function(id, msg){
		gameOutputManager.sendToClient(id, msg);
	}
};


(new CommunicationManager(gameInputManager, gameOutputManager));





});



