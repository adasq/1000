var _ = require('underscore');

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    return text;
}

var ClientCommunicationManager = function(socket){
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

module.exports = ClientCommunicationManager