angular.module('app')
.controller('findEventController', findEventController);

findEventController.$inject = [
  'ionicMaterialInk',
  '$state',
  'eventsService',
  '$scope'
];
function findEventController(ionicMaterialInk, $state, eventsService, $scope){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.events = [];
  vm.show = false;

  animateCss = function (id, animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(id).addClass('animated ' + animationName).one(animationEnd, function() {
      $(id).removeClass('animated ' + animationName);
    });
  };

  eventsService.getMyEvents(0)
  .then(function(response) {
    vm.events = response.data;
    _.each(vm.events, function(event){
      event.banner = event.banner || 'img/default.png';
    });
    vm.showEvent = function(id){
      $state.go('nav.showEvent/:id', {id: id});
    };
  });
  eventsService.getMyEventsCount()
  .then(function(response){
    vm.eventsCount = response.data;
  });
  vm.loadMore = function(){
    eventsService.getMyEvents(vm.events.lenght)
    .then(function(response){
      _.each(response.data.events,function(event){
        event.startsAt = new Date(event.startsAt);
        event.banner = event.banner || 'img/default.png';
        vm.events.push(event);
      });
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  vm.moreData = function(){
    return vm.events.lenght < vm.eventsCount;
  };

  vm.customFilter = function(search){
    _.each(vm.events, function(evento){
      _.each(_.keys(vm.events[0]),function(key){
        return evento.key === search;
      });
    });
  };

  vm.showSearch = function(){
    vm.show = !vm.show;
  };
}
