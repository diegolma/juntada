angular.module('app')
.controller('signupController', signupController);

signupController.$inject = [
  'md5',
  '$ionicPopup',
  'signupService',
  'ionicMaterialInk',
  'loginService',
  '$ionicHistory',
  'pushService',
  '$state'
];
function signupController(md5, $ionicPopup, signupService, ionicMaterialInk, loginService, $ionicHistory, pushService, $state){
  var vm = this;
  ionicMaterialInk.displayEffect();

  vm.signup = function(){
		if(vm.pass != vm.repass){
			$ionicPopup.alert({
				title:"Error",
				template:"La contraseña y su confirmación deben ser iguales.",
        okType: 'button button-assertive'
			});
		}else{
			var data = JSON.stringify(
        {user:{
					address: '',
					name: '',
					lastName: '',
					bornDate: '',
					phone: vm.cel,
					email: vm.mail,
					password: md5.createHash(vm.pass),
					nickname: vm.nickname,
					country_id:1,
				}
			});
			signupService.createUser(data).success(function(response){        
        loginService.setCurrent(JSON.stringify(response.user));
        pushService.init(response.user.id);
        $ionicHistory.nextViewOptions({disableBack:false, historyRoot:true});
        $state.go('nav.events');
      }).error(function(response){
          $ionicPopup.alert({
            title:'Error',
            template:response.message,
            okType: 'button button-assertive'
          });
      });
		}
	};
}
