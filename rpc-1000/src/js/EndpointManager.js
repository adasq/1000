var RPCManager = require('./RPCManager.js');
var _ = require('underscore');

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    return text;
}

var CommunicationManager = function(socket){
  var that = this;
  this.aid = sessionStorage['aid'] || null;
  //syn
  
  socket.on('ACK', function () {
    if(that.aid){
      //reauthorize    
      that.authorize();
    }else{
      //authorie
      that.aid= sessionStorage['aid']= makeid();
    }
    socket.emit('CONNECT', {aid: that.aid});
  });
  this.onMessage = function(fn) {
    socket.on('message', fn);
  };
  

  this.authorize = function(data){
    if(this.aid){ 
      socket.emit('AUTHORIZE', _.extend({aid: that.aid}, data));
    }
  };
  this.send = function(msg){
    socket.emit('message', msg);
  };
};
//===================================================

var EndpointManager = function(url, inputOutputAPIMethods){
  var socket = require('socket.io-client')(url);
  var cm = new CommunicationManager(socket);

  this.authorize = function(username) {
    cm.authorize(username);
  };

  this.send = function(msg) {
    cm.send(msg);
  };

  this.onMessage = function(callback) {
   cm.onMessage(callback);
  };

  this.rpcManager = new RPCManager(this);
  this.rpcManager.prepare(inputOutputAPIMethods);
  this.rpcManager.prepareOutputResponses();

};


module.exports = EndpointManager;