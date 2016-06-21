angular.module('app')
.controller('loginController', loginController);

loginController.$inject = [
  'md5',
  'ionicMaterialInk',
  'loginService',
  '$cordovaOauth',
  '$ionicLoading',
  '$ionicPopup',
  'pushService',
  '$ionicHistory',
  '$state',
  '$timeout'
];
function loginController(md5, ionicMaterialInk, loginService, $cordovaOauth, $ionicLoading, $ionicPopup, pushService, $ionicHistory, $state, $timeout){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.user = '';
  vm.password = '';
  $ionicHistory.clearHistory();

	vm.login = function(){
  	var data = JSON.stringify({
  		user:{
  			nickname: vm.user,
  		  password: md5.createHash(vm.password)
  	 	}
    });
    loginService.login(data);
	};

  vm.loginGO = function(){
    $cordovaOauth.google(GOOGLE_CLIENT_ID, ["email", "profile"]).then(function(result) {
        $ionicLoading.show({'duration': 10000});
        loginService.google(result.access_token).then(function successCallback(response) {
          vm.userData = {
            address: '',
            name: response.data.given_name,
            lastName: response.data.family_name,
            bornDate: '',
            phone: '',
            email: response.data.email,
            password: '',
            nickname: '',
            country_id:1,
            socialId: response.data.id,
            social: 'Google'
          };
          loginService.check(response.data.email, response.data.id).success(function(response){
            switch (response) {
              case 0:
                //error ya existe el email asociado a un usuario pero no el id de la red social
                $ionicLoading.hide();
      					$ionicPopup.alert({
      						title: 'Error',
      						template: 'El email ya está registrado',
      						okType: 'button button-assertive'
      					});
                break;
              case 1:
                //no existe el email ni el id de la red social, le pedimos otros datos
                $timeout(function() {
                    $ionicLoading.hide();
                    angular.element(document.getElementById('completeModal')).triggerHandler('click');
                }, 0);
                break;
              default:
                //ya existen los datos, que inicie sesion
                $ionicLoading.hide();
                loginService.setCurrent(JSON.stringify(response.user));
                pushService.init(response.user.id);
                $state.go('nav.events');                
                break;
            }
          }).error(function(response){
            console.log("error " +JSON.stringify(response));
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error',
              template: 'No se pudieron corroborrar los datos',
              okType: "button button-assertive"
            });
          });
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          console.log(JSON.stringify(response));
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'No se pudo obtener los datos de Google',
            okType: "button button-assertive"
          });
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }, function(error) {
        //usuario cancela proceso de google
    });
  };
}
