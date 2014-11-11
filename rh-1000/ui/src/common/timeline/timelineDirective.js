(function(){ 
angular.module('timeline.directive', [])
.directive('path', function($log){
  var link = function(scope, elem, attr){
    
  };
  return {
    link: link,
    restrict: 'E',
    template: function(elem, attr){
      var leftTemplate='', rightTemplate= '';
     
      if(attr.h){      
          var h = attr.h+'px';
        
  var empty = "<div style='height: "+h+"'></div>";    
        leftTemplate = empty;
        rightTemplate = empty;
        
       template = '<div class="row">'+
'<div class="col-xs-6 text-right path-left">'+
leftTemplate+
'    </div>'+
'    <div class="col-xs-6 text-left path-right">'+rightTemplate+
'    </div>'+
'</div>'; 
        
      }else{
        var content = elem[0].innerHTML;
template = '<div ng-repeat="obj in date.day" class="row">'+
  '<point ng-show="$index>0" class="circle-small"></point>'+
'<div class="col-xs-6 text-right path-left">'+
'<div ng-show="obj.index%2==0" class="desc2">'+ content+
'</div>'+
  '<div ng-show="obj.index%2==1" class="empty"></div>'+
'    </div>'+
'    <div class="col-xs-6 text-left path-right">'+
'<div ng-show="obj.index%2==1" class="desc2">'+
'<div>'+content+'</div>'+
'</div>'+
'<div ng-show="obj.index%2==0" class="empty"></div>'+
'    </div>'+
'</div>'; 
        
        
      }

      return template;
    }
  };
})
.directive('point', function(){
  return {
    restrict: 'E',
    template: function(elem, attr){
      return '<div class="row">'+
'    <div class="col-xs-12 text-center">      '+
'      <div class="'+attr.class+' center">'+
'<span>'+elem[0].innerHTML+'</span>'+
    '</div>'+
'    </div>'+

'  </div>';
    }
  };
});
})();
 