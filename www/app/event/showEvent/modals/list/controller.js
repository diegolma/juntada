angular.module('app').controller('listController', listController);

listController.$inject = [
    '$ionicLoading',
    'showEventsService',
    '$ionicPopup',
    '$scope',
    'loginService',
    'contactsService',
    'md5',
    '$state'
];
function listController($ionicLoading, showEventsService, $ionicPopup, $scope, loginService, contactsService, md5, $state){
    var vm = this;
    var listType = $state.params.listType;
    vm.event = $state.params.evt;
    vm.show = false;
    var master = angular.copy(vm.event);
    var user_id = loginService.getCurrent().id;
    vm.selectedItems = [];
    vm.unSelectedItems = [];

    contactsService().then(function(response){
        vm.contacts = response.data;
        vm.listType = listType;
        var firstLetter;
        vm.aux = {};
        switch (listType) {
            //invitados
            case 1:
                vm.htitle = 'Invitados';
                vm.selectedItems = _.filter(vm.event.guests,function(id){
                    return id !== user_id;
                });
                vm.contacts = _.map(vm.contacts, function(contact){{
                    contact.selected = _.contains(vm.selectedItems,contact.id) ? true : false;
                    contact.photo = contact.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(contact.email.toLowerCase()) + '?s=200';
                    return contact;
                }});
                for(var i = 0; i < vm.contacts.length; i++) {
                	firstLetter = vm.contacts[i].nickname.substring(0,1).toUpperCase();
                	if(!vm.aux[firstLetter]) vm.aux[firstLetter] = [];
                	vm.aux[firstLetter].push(vm.contacts[i]);
                }
            break;
            //organizadores
            case 2:
                vm.htitle = 'Organizadores';
                vm.selectedItems = _.filter(vm.event.organizers, function(id){
                    return id !== user_id;
                });
                vm.contacts = _.map(vm.contacts, function(contact){{
                    contact.selected = _.contains(vm.selectedItems,contact.id) ? true : false;
                    contact.photo = contact.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(contact.email.toLowerCase()) + '?s=200';
                    return contact;
                }});
                for(var j = 0; j < vm.contacts.length; j++) {
                	firstLetter = vm.contacts[j].nickname.substring(0,1).toUpperCase();
                	if(!vm.aux[firstLetter]) vm.aux[firstLetter] = [];
                	vm.aux[firstLetter].push(vm.contacts[j]);
                }
            break;
            default:
        }
    });

    vm.save = function(type){
        var user_id = loginService.getCurrent().id;
        var others = [];        
        if (type === 2)
            others = _.filter(vm.event.organizers,function(id){
                return id !== user_id;
            });
        else
            others = _.filter(vm.event.guests,function(id){
                return id !== user_id;
            });
        var state = changes(others,vm.selectedItems);
        if(state) {
            vm.add = state[0].length > 0;
            vm.newAdded = state[0];
            vm.remove = state[1].length > 0;
            vm.newRemoved = state[1];
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmar cambios',
                scope: $scope,
                templateUrl: 'app/event/showEvent/modals/confirmModal.html',
                cancelText: 'No',
                okText: 'Sí'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $ionicLoading.show({'duration': 10000});
                    if (type === 2)
                        showEventsService.setOrganizers(vm.event.id,vm.selectedItems,vm.unSelectedItems)
                        .success(function(){
                            vm.event.organizers = vm.selectedItems;
                            $ionicLoading.hide();
                            $ionicLoading.show({template: 'Actualizado', duration: 2000}).then(function(r) {});
                            master = angular.copy(vm.event);
                        }).error(function(){
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Error',
                                template: 'Edición no realizada. Chequea tu conexión a internet',
                                okType: 'button button-assertive ink'
                            }).then(function(){
                            });
                        });
                    else
                        showEventsService.setGuests(vm.event.id,vm.selectedItems,vm.unSelectedItems)
                        .success(function(){
                            vm.event.guests = vm.selectedItems;
                            $ionicLoading.hide();
                            $ionicLoading.show({template: 'Actualizado', duration: 2000}).then(function(r) {});
                        }).error(function(){
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Error',
                                template: 'Edición no realizada. Chequea tu conexión a internet',
                                okType: 'button button-assertive ink'
                            }).then(function(){
                            });
                        });
                } else {
                    //no se hace nada x ahora
                }
            });
        }
    };

    vm.showSearch = function(){
      vm.show = !vm.show;
    };

    $scope.$on('$ionicView.beforeLeave', function (event, viewData) {
      angular.copy(master,vm.event);
      vm.selectedItems = [];
      vm.unSelectedItems = [];
    });


    vm.nickname = function(id){
        return _.find(vm.contacts, function(contact){
            return contact.id === id;
        }).nickname;
    };

    //la idea de la funcion es ver desde un listado original si hubo cambios y cuales son
    //@param listA representa los seleccionados originalmente
    //@param listB representa los seleccionados al momento de ejecucion
    function changes(listA,listB){
        var newList = [];
        var newAdded = _.difference(listB, listA);
        newList.push(newAdded);
        var newRemoved = _.difference(listA, listB);
        newList.push(newRemoved);
        if (newList[0].length === 0 && newList[1].length === 0)
        return false;
        return newList;
    }

    $scope.$watch('vm.contacts', function(contact){
        var selectedItems = [];
        var unSelectedItems = [];
        angular.forEach(contact, function(contact){
            if (contact.selected)
            selectedItems.push(contact.id);
            else
            unSelectedItems.push(contact.id);
        });
        vm.selectedItems = selectedItems;
        vm.unSelectedItems = unSelectedItems;
    }, true);
}
