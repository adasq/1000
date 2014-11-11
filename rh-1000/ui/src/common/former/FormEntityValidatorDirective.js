(function(){ 
var FormEntityValidator = function($log){
     var link = function(scope, element, attr, controller) {
            var setCurrentFieldValidity = function(valid){
                controller.$setValidity('unique', valid);
            };
            var fieldValidator = scope.field.field_validator;
            scope.field.triggerValidation = function(){
          setCurrentFieldValidity(fieldValidator(scope.field.field_value));
        };
			if(fieldValidator){
				scope.$watch(attr.ngModel, function(newValue) {
                    setCurrentFieldValidity(fieldValidator(newValue));
                  });
      }
    };
        return {
          require: "ngModel",
          link: link,
          restrict: "A"      
        };

};
angular
.module("former")
.directive("formEntityValidator", FormEntityValidator);
})();

