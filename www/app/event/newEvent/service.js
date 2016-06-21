angular.module('app')
.factory('newEventService', newEventService);

newEventService.$inject = [
  '$cordovaGeolocation',
  '$http'
];
function newEventService($cordovaGeolocation, $http){
  var opt = {timeout:10000, enableHighAccuracy: false};
	return{
		getPosition: function(){
			return $cordovaGeolocation.getCurrentPosition(opt);
		},
    create: function(data){
        return $http.post(BASE_URL+'events', data);
    }
	};
}
