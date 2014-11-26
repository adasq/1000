var SocketManager = require('./socketManager.js');
var RPCManager = require('./RPCManager.js');


var ProxyManager = function(server) {
	var socketManager = new SocketManager(server);
	var CommunicationManager = require('./CommunicationManager.js')(socketManager);

var gameOutputManager = {
	send: function(aid, msg){}
};

var gameInputManager = {	
	onPlayerReconnected: function(aid){
		console.log('!!!!!!!!!! onPlayerREconnected ', aid);		
	},	
	onPlayerConnected: function(aid){
		console.log('!!!!!!!!!! onPlayerConnected ', aid);
	},
	onMessage: function(aid, msg) {
		console.log('!!!!!!!!!! onMessage ', aid, msg);
		gameOutputManager.send(aid, {type: 'response', data: {wt: 'f'} })
	}	
};

(new CommunicationManager(gameInputManager, gameOutputManager));




var rpcManager = new RPCManager();



var server = {
  // output ============================
  cardToClient: function(cid){},
  
  //input ===========================
  onThrowCard: function(cid){
    //console.log(this);
    this.cardToClient('xd').then(function(result){
      console.log(result);
    });
  },  
  
};

rpcManager.prepare(server);


console.log(rpcManager.inputTypeCallbacks);
console.log('-----')
console.log(rpcManager.outputTypeCallbacks);

rpcManager.prepareOutputResponses();


};

module.exports = ProxyManager;