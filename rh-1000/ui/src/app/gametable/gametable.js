
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
  this.aid = sessionStorage['aid'] || null;
  $log.log(this.aid);
  //syn

  socket.on('ACK', function () {
    if(that.aid){
      //reauthorize    
      that.authorizeAsPlayer();
    }else{
      //authorie
      that.aid= sessionStorage['aid']= makeid();
    }
    socket.emit('CONNECT', {aid: that.aid});

  });

  socket.on('message', function(msg){
      console.table(msg);
  });
  this.authorizeAsPlayer = function(playerName){
    if(this.aid){
      socket.emit('AUTHORIZE', {aid: that.aid, name: (playerName || null)});
    }
  };
  this.authorizeAsTable = function(){
    socket.emit('AUTHORIZE', {});
  };
  this.send = function(msg){
    socket.emit('message', msg);
  };
};
//================================================================================
var gameOutputManager = {
  throwCard: function(aid){

  }
};
var gameInputManager = {
  onReceiveCard: function(aid){
    $log.log('otrzymalem karte aid: ', aid);
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

