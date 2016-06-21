angular.module('app')
.factory('contactsService', contactsService);

contactsService.$inject = [
  '$http',
  'loginService'
];
function contactsService($http, loginService){
  return function(){
		var cu = loginService.getCurrent();
		return $http.get(BASE_URL + 'users/' + cu.id + '/contacts');
	};
}
