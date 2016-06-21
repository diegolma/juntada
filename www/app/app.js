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

.run(function($ionicPlatform, pushService, $state) {
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

  var cu = localStorage.getItem('juntadaUser');
  if(cu){
    //si ya esta logueado inicializo las notificaciones push
    pushService.init(cu.id);
    $state.go('nav.events');
  }else{
    $state.go('login');
  }
});
