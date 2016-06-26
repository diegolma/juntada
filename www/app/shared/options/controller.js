angular.module('app')
.controller('optionsController', optionsController);

optionsController.$inject = [
  'ionicMaterialInk',
  'loginService',
  '$state',
  'pushService',
  '$ionicLoading',
  '$ionicPopup'
];
function optionsController(ionicMaterialInk, loginService, $state, pushService, $ionicLoading, $ionicPopup){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.user = {};
  vm.user = loginService.getCurrent();
  vm.notifications = vm.user.notif === 1 ? true : false;
  vm.logout = function(){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Cerrar sesión',
      template: '¿Está seguro que desea cerrar la sesión?',
      okText: 'Sí',
      cancelText: 'No'
    });
    confirmPopup.then(function(res) {
      if(res) {
        pushService.stop(vm.user.id);
        localStorage.clear();
        $state.go('login');
      } else {}
    });
  };

  vm.pushNotificationChange = function() {
    if(vm.notifications){
      pushService.init(vm.user.id);
      vm.user.notif = 1;
      loginService.setCurrent(JSON.stringify(vm.user));
      $ionicLoading.show({template: 'Activado', duration: 2000});
    }else{
      pushService.stop(vm.user.id);
      vm.user.notif = 0;
      loginService.setCurrent(JSON.stringify(vm.user));
      $ionicLoading.show({template: 'Desactivado', duration: 2000});
    }
  };
}
