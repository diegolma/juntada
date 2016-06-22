angular.module('app')
.controller('addContactController', addContactController);

addContactController.$inject = [
  'loginService',
  'addContactService',
  'md5',
  '$ionicLoading',
  '$scope'
];
function addContactController(loginService, addContactService, md5, $ionicLoading, $scope){
  var vm = this;
  vm.users = [];
  var cu = loginService.getCurrent();
  vm.show = false;
  var firstLetter;
  vm.aux = {};

	addContactService.minify(cu.id)
  .success(function(data){
		vm.users = data;
    _.each(vm.users, function(user){
      user.photo = user.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(user.email.toLowerCase()) + '?s=100';
    });
    for(var i = 0; i < vm.users.length; i++) {
      firstLetter = vm.users[i].nickname.substring(0,1).toUpperCase();
      if(!vm.aux[firstLetter]) vm.aux[firstLetter] = [];
      vm.aux[firstLetter].push(vm.users[i]);
    }
	});

	vm.cond ='';
	vm.add = function(user){
		addContactService.add(user.id).success(function(){
      cu.contactsCount += 1;
      loginService.setCurrent(JSON.stringify(cu));
      $scope.$emit('addContact');
			vm.users = _.without(vm.users, user);
      vm.aux = {};
      for(var i = 0; i < vm.users.length; i++) {
        firstLetter = vm.users[i].nickname.substring(0,1).toUpperCase();
        if(!vm.aux[firstLetter]) vm.aux[firstLetter] = [];
        vm.aux[firstLetter].push(vm.users[i]);
      }
      $ionicLoading.show({template: 'Añadido', duration: 2000});
		});
	};

  vm.showSearch = function(){
    vm.show = !vm.show;
  };

  vm.update = function(){
      vm.users = [];
      var firstLetter;
      vm.aux = {};
      addContactService.minify(cu.id)
    .success(function(data){
  		vm.users = data;
      _.each(vm.users, function(user){
        user.photo = user.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(user.email.toLowerCase()) + '?s=100';
      });
      for(var i = 0; i < vm.users.length; i++) {
        firstLetter = vm.users[i].nickname.substring(0,1).toUpperCase();
        if(!vm.aux[firstLetter]) vm.aux[firstLetter] = [];
        vm.aux[firstLetter].push(vm.users[i]);
      }
      $scope.$broadcast('scroll.refreshComplete');
  	});
  };
}
