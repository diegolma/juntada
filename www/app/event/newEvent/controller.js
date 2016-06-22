angular.module('app')
.controller('newEventController', newEventController);

newEventController.$inject = [
  '$ionicLoading',
  'pictureService',
  '$ionicPopup',
  'loginService',
  '$state',
  '$scope',
  '$ionicPickerI18n'
];
function newEventController($ionicLoading, pictureService, $ionicPopup, loginService, $state, $scope, $ionicPickerI18n){
  var vm = this;
  vm.currentDate = new Date();
  vm.title = 'Elige una fecha y hora';
  vm.buttonOk = 'Sí';
  vm.buttonCancel = 'No';
  $ionicPickerI18n.weekdays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
  $ionicPickerI18n.ok = "Sí";
  $ionicPickerI18n.cancel = "No";
  $ionicPickerI18n.months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

  vm.location = function(){
    if (vm.event.name !== '' && vm.event.description !== '') {
  		if(vm.currentDate <= vm.event.startsAt){
  			if(vm.event.startsAt < vm.event.endsAt) {
  				$state.go("nav.newEvent/location",{evt:vm.event});
  			}else {
  				$ionicPopup.alert({
  					title: 'Error',
  					template: 'La fecha final no puede ser menor a la inicial',
  					okType: 'button button-assertive'
  				});
  			}
  		}else{
  			$ionicPopup.alert({
  				title: 'Error',
  				template: 'La fecha inicial no puede ser menor a la actual',
  				okType: 'button button-assertive'
  			});
  		}
    }else{
      $ionicPopup.alert({
        title: 'Error',
        template: 'El título y la descripción no pueden estar vacías',
        okType: 'button button-assertive'
      });
    }
  };

  vm.event = {
    name: '',
    description: '',
    contentControl:false,
    private:false,
    price:0,
    startsAt: new Date(),
    endsAt: new Date(new Date().setHours(new Date().getHours() + 1)),
    lat: 0,
    lng: 0
  };

	vm.getPicture = function(){
		pictureService.original().then(function(image){
			var url = "data:image/jpeg;base64,"+image;
			vm.newBanner = {'background-image': 'url('+url+')'};
			vm.event.banner = url;
		});
	};

}
