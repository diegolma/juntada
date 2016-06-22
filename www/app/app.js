// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
  'ionic',
  'ionic-material',
  'angular-md5',
  'angular-storage',
  'ngCordova',
  'ui.bootstrap',
  'ngCordovaOauth',
  'fabDirective',
  'ion-datetime-picker'
])

.config(function($ionicConfigProvider){
  $ionicConfigProvider.views.maxCache(0);
})

.run(function($ionicPlatform, pushService, $state, $ionicPopup, $interval, $ionicHistory) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


  var count = 0;
  var stopTime = $interval(updateCount, 3000);
  function updateCount(){
      count = 0;
  }
  $ionicPlatform.registerBackButtonAction(function (event) {
      count++;
      //si presiona el btn back del dispositivo + de una vez en menos de 3 segundos
      if(count > 1){
          var confirmPopup = $ionicPopup.confirm({
              title: 'Cerrar aplicación',
              template: '¿Está seguro que desea cerrar la aplicación?',
              okText: 'Sí',
              cancelText: 'No'
          });
          confirmPopup.then(function(res) {
              if(res) {
                  navigator.app.exitApp();
              } else {
                  count = 0;
              }
          });
      }else
      {
          //navigator.app.backHistory();
          $ionicHistory.goBack(-1);
      }
  }, 100);

  var cu = localStorage.getItem('juntadaUser');
  if(cu){
    //si ya esta logueado inicializo las notificaciones push
    pushService.init(cu.id);
    $state.go('nav.events');
  }else{
    $state.go('login');
  }
});
