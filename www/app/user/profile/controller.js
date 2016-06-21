angular.module('app')
.controller('profileController', profileController);

profileController.$inject = [
  'ionicMaterialInk',
  'loginService',
  'profileService',
  'md5',
  '$ionicLoading',
  '$ionicPopup',
  'pictureService',
  '$scope'
];
function profileController(ionicMaterialInk, loginService, profileService, md5, $ionicLoading, $ionicPopup, pictureService, $scope){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.user = loginService.getCurrent();
  vm.button = 'Editar';
  vm.editing = false;
  vm.user.photo = vm.user.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(vm.user.email.toLowerCase()) + '?s=200';
  vm.pic = {'background-image' : 'url('+vm.user.photo+')' , 'height': '100px', 'width' : '100px'};

  animateCss = function (id, animationName) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      $(id).addClass('animated ' + animationName).one(animationEnd, function() {
          $(id).removeClass('animated ' + animationName);
      });
  };

  animateCss('.hero','slideInUp');

  vm.toggleButton = function(){
    if(!vm.editing){
      vm.button = 'Guardar Cambios';
    }else{
      vm.button = 'Editar';
    }
    vm.editing = !vm.editing;
  };

  vm.saveData = function(){
    if (!vm.editing) {
      $ionicLoading.show({'duration': 10000});
      var data = JSON.stringify({
        user: vm.user
      });
      profileService.update(vm.user.id, data).then(function(response){
        response = response.data;
        if(response.user){
          $ionicLoading.hide();
          loginService.setCurrent(JSON.stringify(response.user));
          $scope.$emit('change');
          $ionicLoading.show({template: 'Actualizado', duration: 2000});
        }
      });
    }
  };

  vm.upPhoto = function(option){
		$ionicLoading.show({'duration': 10000});
		pictureService.custom(option).then(function(img){
			profileService.upload(vm.user.id,'data:image/jpeg;base64,' +img)
      .success(function(response){
				$ionicLoading.hide();
				vm.user.photo = 'data:image/jpeg;base64,' +img;
        vm.pic = {'background-image' : 'url('+vm.user.photo+')' , 'height': '100px', 'width' : '100px'};
        loginService.setCurrent(JSON.stringify(vm.user));
        $scope.$emit('change');
				$ionicLoading.show({template: 'Actualizado', duration: 2000});
			}).error(function(){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: 'Edición no realizada. Chequea tu conexión a internet',
					okType: 'button button-assertive'
				});
			});
		});
	};
}
