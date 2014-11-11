(function(){ 
var FormEntity = function($http, $compile, $templateCache){
	var linker = function(scope, element) {
         //   $http.get('former/formEntity.tpl.html').then(function(template){
               // element.html(template.data);
                //$compile(element.contents())(scope);
         //   });
        };
        return {            
            restrict: 'E',
            scope: {
                field:'='
            },
            templateUrl: 'former/formEntity.tpl.html',
            link: linker
        };
};
angular
.module("former")
.directive("mbFormEntity", FormEntity);
})();
 