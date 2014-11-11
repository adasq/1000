angular
.module( 'time', [])
.service("Time", function(){

this.dateToUserFriendlyString = function(date){
	return moment(date).fromNow();
};
	

})
.filter('fromNow', function(Time) {
    return function(dateString) {
      return Time.dateToUserFriendlyString(dateString);
    };
  });
