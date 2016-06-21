angular.module('app').controller('editController', editController);

editController.$inject = [
  '$ionicLoading',
  'newEventService',
  '$ionicPopup',
  '$scope',
  'loginService',
  '$state',
  '$ionicPickerI18n'
];
function editController($ionicLoading, newEventService, $ionicPopup, $scope, loginService, $state, $ionicPickerI18n){
  var vm = this;
  vm.event = $state.params.evt;
  var master = angular.copy(vm.event);
  vm.title = 'Elige una fecha y hora';
  vm.buttonOk = 'Sí';
  vm.buttonCancel = 'No';
  $ionicPickerI18n.weekdays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
  $ionicPickerI18n.ok = "Sí";
  $ionicPickerI18n.cancel = "No";
  $ionicPickerI18n.months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

  vm.save = function(){
    if (JSON.stringify(master) === JSON.stringify(vm.event)) {
      return false;
    }
    var user_id = loginService.getCurrent().id;
    //primero se realizan los mismos chequeos que al crear un evento
    var currentDate = new Date();
    if(currentDate <= vm.event.startsAt){
      if (vm.event.startsAt <= vm.event.endsAt) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Editar evento',
          template: '¿Está seguro?',
          okText: 'Sí',
          cancelText: 'No'
        });
        confirmPopup.then(function(res) {
          if(res) {
            vm.event.startsAt.setUTCHours(vm.event.startsAt.getUTCHours() - 3);
            vm.event.endsAt.setUTCHours(vm.event.endsAt.getUTCHours() - 3);
            var data = JSON.stringify(
              {'event':
              {'id':vm.event.id,
              'name': vm.event.name,
              'description': vm.event.description,
              'price': vm.event.price,
              'startsAt': vm.event.startsAt,
              'endsAt': vm.event.endsAt}
            });
            $ionicLoading.show({'duration': 10000});
            newEventService.create(data)
            .then(function(response){
              response = response.data;
              $ionicLoading.hide();
              $ionicLoading.show({template: 'Actualizado', duration: 2000});
            }).error(function(){
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: 'Error',
                template: 'Edición no realizada. Chequea tu conexión a internet',
                okType: 'button button-assertive ink'
              }).then(function(){
              });
            });
          } else {}
        });
      }else {
        $ionicPopup.alert({
          title: 'Error',
          template: 'La fecha final no puede ser menor a la inicial',
          okType: 'button button-assertive ink'
        }).then(function(){
        });
      }
    }else{
      $ionicPopup.alert({
        title: 'Error',
        template: 'La fecha inicial no puede ser menor a la actual',
        okType: 'button button-assertive ink'
      }).then(function(){
      });
    }
  };
}
