angular.module('app')
.factory('addContactService', addContactService);

addContactService.$inject = [
  '$http',
  'loginService'
];
function addContactService($http, loginService){
  return {
    add: add,
    minify: minify
  };

  function add(id){
    var current_id = loginService.getCurrent().id;
		return $http.post(BASE_URL + 'users/'+current_id+'/contacts', JSON.stringify({id: id}));
  }

  function minify(param){
    if(param){
			return $http.get(BASE_URL+'users/minify/'+param);
		}
  }
}
