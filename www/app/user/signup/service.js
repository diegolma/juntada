angular.module('app')
.factory('signupService', signupService);

signupService.$inject = [
  '$http'
];
function signupService($http){
  return {
    createUser: createUser,
    createUserSocial: createUserSocial
  };

  function createUser(data){
    return $http.post(BASE_URL + 'users', data);
  }

  function createUserSocial(data){
    return $http.post(BASE_URL + 'users/social', data);
  }
}
