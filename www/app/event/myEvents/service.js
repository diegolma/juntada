angular.module('app')
.factory('myEventsService', myEventsService);

myEventsService.$inject = [
  'loginService',
  '$http'
];
function myEventsService(loginService, $http){
  return {
    getMyEVENTS: function(since){ //te devuelo los eventos que organizo
  		var currentUser = loginService.getCurrent();  		
  		return $http.get(BASE_URL + 'users/'+currentUser.id+'/myevents/'+since);
  	},
		getMyEVENTSCount: function(){
			var currentUser = loginService.getCurrent();
			return $http.get(BASE_URL + 'users/'+currentUser.id+'/myeventsCount');
		}
  };
}
