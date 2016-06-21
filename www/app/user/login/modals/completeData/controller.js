angular.module('app').controller('completeModalController', completeModalController);

completeModalController.$inject = [
    '$ionicLoading',
    '$ionicPopup',
    '$scope',
    '$uibModalInstance',
    'signupService',
    '$ionicHistory',
    '$state',
    'pushService',
    'loginService'
];
function completeModalController($ionicLoading, $ionicPopup, $scope, $uibModalInstance, signupService, $ionicHistory, $state, pushService, loginService){
  var vm = this;
  vm.user = $scope.$parent.vm.userData;
  vm.reset = function(){
    $uibModalInstance.close();
  };

  vm.signup = function(){
    hideModal();
    $ionicLoading.show({'duration': 10000});
    signupService.createUserSocial(JSON.stringify({user:vm.user})).success(function(response){
      loginService.setCurrent(JSON.stringify(response.user));
      pushService.init(response.user.id);
      $ionicHistory.nextViewOptions({disableBack:false, historyRoot:true});
      $ionicLoading.hide();
      $state.go('nav.events');
    }).error(function(response){
      $ionicLoading.hide();
      restoreModal();
      console.log("error" +JSON.stringify(response));
    });
  };

  function hideModal(){
      $('#loginModal').parent().parent().parent().css('display','none');
      vm.element = $('.modal-backdrop');
      vm.element.removeClass('modal-backdrop');
  }

  function restoreModal(){
      $('#loginModal').parent().parent().parent().css('display','initial');
      vm.element.addClass('modal-backdrop');
  }
}
