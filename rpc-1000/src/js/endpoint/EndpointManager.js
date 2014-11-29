var 
	RPCManager = require('../RPCManager.js'),
	ClientCommunicationManager = require('./ClientCommunicationManager.js'),
	_ = require('underscore');


var EndpointManager = function(url, inputOutputAPIMethods){
  var socket = require('socket.io-client')(url);
  this.clientCommunicationManager = new ClientCommunicationManager(socket);

  this.rpcManager = new RPCManager(this.clientCommunicationManager);
  this.rpcManager.prepare(inputOutputAPIMethods);
  this.rpcManager.prepareOutputResponses();

};


module.exports = EndpointManager;