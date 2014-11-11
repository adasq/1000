
angular.module( '1000.home', [
  'ui.router',
  'ui.bootstrap',
  'socket'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

.controller( 'HomeCtrl', function HomeController($scope, $log, socket) {
  var messages = [];

 $log.log('inited!!!!!!');
  socket.on('SYN', function (message) {
    $log.log(message);
  });


});

