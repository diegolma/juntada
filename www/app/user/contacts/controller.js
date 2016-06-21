angular.module('app')
.controller('contactsController', contactsController);

contactsController.$inject = [
  'ionicMaterialInk',
  '$ionicLoading',
  '$scope',
  'contactsService',
  'md5',
  '$state'
];
function contactsController(ionicMaterialInk, $ionicLoading, $scope, contactsService, md5, $state){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.contacts = [];
  var firstLetter;
  vm.aux = {};
  vm.show = false;

  vm.go = function(){
    $state.go("nav.addContact");
  };

  $ionicLoading.show({'duration': 10000});
  contactsService()
  .then(function(response){
    vm.contacts = response.data;
    _.each(vm.contacts, function(user){
      user.photo = user.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(user.email.toLowerCase()) + '?s=100';
    });
    for(var i = 0; i < vm.contacts.length; i++) {
      firstLetter = vm.contacts[i].nickname.substring(0,1).toUpperCase();
      if(!vm.aux[firstLetter]) vm.aux[firstLetter] = [];
      vm.aux[firstLetter].push(vm.contacts[i]);
    }
    $ionicLoading.hide();
  });

  vm.showSearch = function(){
    vm.show = !vm.show;
  };

}
