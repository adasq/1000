
angular.module( '1000.gametable', [
  'ui.router',
  'ui.bootstrap',
  'socket',
  '1000.gametable.join'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'gametable', {
    url: '/{tid:[a-z]{1,8}}',
    views: {
      "main": {
        controller: 'GameCtrl',
        templateUrl: 'gametable/gametable.tpl.html'
      }
    },
    data:{ pageTitle: 'gametable' }
  });
})

.controller( 'GameCtrl', function GameCtrl($scope, $state, $log, socket) {

 var tid = $state.params.tid;





$scope.connectionState = {
  iAmConnected: false,
  table: {
    isConnected: true,
    state: null
  },
  users: [
  {
    name: 'adam',
    isConnected: true
  },
  {
    name: 'xxxx',
    isConnected: true
  }]
};


function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    return text;
}
var CommunicationManager = function(socket, gameOutputManager, gameInputManager){
var that = this;
  this.cid = null;

  socket.on('ACK', function (response) {    
    console.log('rdy');  
    if(sessionStorage['cid']){
      //reauthorize      
      that.cid = sessionStorage['cid'];
      that.authorizeAsPlayer();
    }else{
      sessionStorage['cid']= response.cid;
      that.cid = response.cid;

    }
  });

  socket.on('message', function(msg){
      $log.log('message!', msg);
  });
  this.authorizeAsPlayer = function(playerName){
    if(this.cid){
      socket.emit('SYN-ACK', {cid: that.cid, name: (playerName || null)});
    }
  };
  this.authorizeAsTable = function(){
    socket.emit('SYN-ACK', {});
  };
  this.send = function(msg){
    socket.emit('message', msg);
  };
};

var gameOutputManager = {
  throwCard: function(cid){}
};
var gameInputManager = {
  onReceiveCard: function(cid){
    $log.log('otrzymalem karte cid: ', cid);
  }
};
var cm = new CommunicationManager(socket, gameOutputManager, gameInputManager);

$scope.change = function(){
  cm.send($scope.msg);
};
$scope.msg = 'aaaaa';

 
$scope.onJoinAsPlayer = function(playerName){
  cm.authorizeAsPlayer(playerName);
};


});

