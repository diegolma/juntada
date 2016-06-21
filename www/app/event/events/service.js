angular.module('app')
.factory('eventsService', eventsService);

eventsService.$inject = [
  'loginService',
  '$http'
];
function eventsService(loginService, $http){
  return {
    getMyEvents: getMyEvents,
    getMyEventsCount: getMyEventsCount
  };

  function getMyEvents(since) {
    var currentUser = loginService.getCurrent();
		return $http.get(BASE_URL + 'users/'+currentUser.id+'/events/' + since);
  }
  function getMyEventsCount() {
    var currentUser = loginService.getCurrent();
		return $http.get(BASE_URL + 'users/'+currentUser.id+'/eventsCount');
  }
}
