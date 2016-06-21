angular.module('app')
.factory('profileService', profileService);

profileService.$inject = [
  '$http'
];
function profileService($http) {
  return {
    update: update,
    upload: upload
  };

  function update(id, data){
    return $http.put(BASE_URL + 'users/' + id, data);
  }

  function upload(id, data){
    return $http.post(BASE_URL + 'users/' + id + '/loadP', data);
  }
}
