(function(){
var FormManager = function(){

	this.getModelData = function(fields){
		var formData= {};
		_.each(fields, function(field){
						formData[field.field_name] = field.field_value;
					});
		return formData;
	};

};
angular
.module("former")
.service("FormManager", FormManager);
})();

