angular.module('app')
.controller('eventsController', eventsController);

eventsController.$inject = [
  'ionicMaterialInk',
  '$state',
  'eventsService',
  '$scope',
  '$ionicScrollDelegate'
];
function eventsController(ionicMaterialInk, $state, eventsService, $scope, $ionicScrollDelegate){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.show = false;
  vm.events = [];

  animateCss = function (id, animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(id).addClass('animated ' + animationName).one(animationEnd, function() {
      $(id).removeClass('animated ' + animationName);
    });
  };

  angular.element(document).ready(function () {
    _.each(vm.events, function(event){
      animateCss('#a'+event.id,'bounceInDown');
    });
  });

  eventsService.getMyEvents(0)
  .then(function(response) {
    vm.events = response.data;
    _.each(vm.events, function(event){
      event.startsAt = new Date(event.startsAt);
      event.banner = event.banner || 'img/default.png';
    });
  });
  eventsService.getMyEventsCount()
  .then(function(response){
    vm.eventsCount = response.data;
  });

  vm.loadMore = function(){
    eventsService.getMyEvents(vm.events.length)
    .then(function(response){
      _.each(response.data,function(event){
        event.startsAt = new Date(event.startsAt);
        event.banner = event.banner || 'img/default.png';
        vm.events.push(event);
      });
      $ionicScrollDelegate.resize();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  vm.moreData = function(){
    return vm.events.length < vm.eventsCount;
  };

  vm.showEvent = function(id){
    $state.go('nav.showEvent/:id', {id: id});
  };

  vm.showSearch = function(){
    vm.show = !vm.show;
  };
}
