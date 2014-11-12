
angular.module( '1000.gametable.join', [
  'ui.bootstrap'
])
.directive( 'join', function ($log) {

  var link = function(scope, elem, attr, ngModelCtrl){

  scope.openTable = function(){

  };

  scope.nick = 'example';
 

  scope.joinTable = function(){
    scope.onJoinAsPlayer(scope.nick);
  };

  scope.$watch(function(){
    return ngModelCtrl.$modelValue;
  }, function(newValue, oldValue){
    if(newValue){
      scope.connectionState = newValue;
    }    
  });

  };

return {
  link: link,
  require: 'ng-model',
  scope:{
    onJoinAsPlayer: '='
  },
  restrict: 'E',
  templateUrl: 'gametable/join/join.tpl.html'
};

});

