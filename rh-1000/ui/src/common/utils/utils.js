angular
.module( 'utils', [])
.service("Utils", function($state){

this.redirect = function(targetState, targetParams){
	$state.go(targetState, targetParams);
};
	

});
