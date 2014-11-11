angular.module( '1000', [
  'templates-app',
  'templates-common',
  '1000.home',
  '1000.gametable'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})
.run( function run () {
})
.controller( 'AppCtrl', function AppCtrl ( $timeout, $location,  $scope, $log, $state, $rootScope) {

});

