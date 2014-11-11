
angular.module( '1000.gametable', [
  'ui.router',
  'ui.bootstrap',
  'socket'
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
  this.isReadyToAuthorize = false;

  socket.on('ACK', function () {
    console.log('rdy');
    that.isReadyToAuthorize = true;
  });

  socket.on('message', function(msg){
      $log.log('message!', msg);
  });
  this.authorizeAsPlayer = function(playerName){
    if(this.isReadyToAuthorize){
      socket.emit('SYN-ACK', {name: (playerName || makeid())});
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


setTimeout(function() {
  cm.authorizeAsPlayer();
}, 200);


});

