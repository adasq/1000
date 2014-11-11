angular
.module( 'requestHandler', [])
.service("RequestHandler", function($http, $log, $q){
	var API_URL = "";
	
	this.send= function(method, data){

		var defer = $q.defer(),
		successCallback= function(response){
			if(response.error){				 
				defer.reject(response.reason);
			}else{
				defer.resolve(response.response);
			}			
		},
		errorCallback= function(response){ 
			defer.reject(response);
		};

		$http({
			method: "POST",
			data: data,
			url: API_URL+'/'+method			
		}).success(successCallback).error(errorCallback);

		return defer.promise;
	};
});
