angular.module('app')
.factory('loginService', loginService);

loginService.$inject = [
  '$http',
  '$state',
  '$ionicPopup',
  '$ionicHistory',
  'pushService'
];
function loginService($http, $state, $ionicPopup, $ionicHistory, pushService){

  return {
    login: login,
    getCurrent: getCurrent,
    setCurrent: setCurrent,
    google: google,
    check : check
  };

  function login(data){
    $http.post(BASE_URL + 'auth', data)
      .then(function(response){
        response = response.data;
        if(response.user){
        	setCurrent(response.user);
          localStorage.setItem('juntadaUser', JSON.stringify(response.user));
          pushService.init(response.user.id);
       		$ionicHistory.nextViewOptions({disableBack:true, historyRoot:true});//impide que el usuario vuelva al login presionando back.
          $state.go('nav.events');
        }else{
          var alert = $ionicPopup.alert({
            title:"Error",
            template: "Usuario y/o contraseña incorrecto",
            okType: "button button-assertive"
          });
        }
      });
	}

  function getCurrent(){
    return JSON.parse(localStorage.getItem('juntadaUser'));
  }

  function setCurrent(user){
    localStorage.setItem('juntadaUser', user);
  }

  function google(token){
    return $http({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        'Authorization': 'Bearer '+token
      }
    });
  }

  function check(email, id){
    return $http.get(BASE_URL + 'auth/' + email + '/id/' + id);
  }
}
