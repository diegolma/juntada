angular.module('app')
.controller('navController', navController);

navController.$inject = [
  'ionicMaterialInk',
  'loginService',
  'md5',
  '$rootScope',
  '$scope'
];
function navController(ionicMaterialInk, loginService, md5, $rootScope, $scope){
  var vm = this;
  ionicMaterialInk.displayEffect();
  vm.user = loginService.getCurrent();  

  $scope.$on('addContact', function(event) {
    vm.user.contactsCount += 1;
  });

  $scope.$on('addEvent', function(event) {
    vm.user.myEventsCount += 1;
    vm.user.eventsCount += 1;
  });

  $scope.$on('cancelEvent', function(event) {
    vm.user.myEventsCount -= 1;
    vm.user.eventsCount -= 1;
  });

  $scope.$on('change', function(event) {
    vm.user = loginService.getCurrent();
    vm.user.photo = vm.user.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(vm.user.email.toLowerCase()) + '?s=200';
  });

  if(vm.user && vm.user.email){
    vm.user.photo = vm.user.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(vm.user.email.toLowerCase()) + '?s=200';
  }
}
