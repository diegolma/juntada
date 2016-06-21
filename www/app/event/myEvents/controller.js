angular.module('app')
.controller('myEventsController', myEventsController);

myEventsController.$inject = [
  'ionicMaterialInk',
  '$state',
  'myEventsService',
  '$scope',
  '$ionicHistory',
  '$ionicLoading',
  '$ionicScrollDelegate'
];
function myEventsController(ionicMaterialInk, $state, myEventsService, $scope, $ionicHistory, $ionicLoading, $ionicScrollDelegate){
  ionicMaterialInk.displayEffect();
  var vm = this;
  vm.events = [];
  vm.show = false;
  $ionicLoading.show({'duration': 10000});

  animateCss = function (id, animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(id).addClass('animated ' + animationName).one(animationEnd, function() {
      $(id).removeClass('animated ' + animationName);
    });
  };

  myEventsService.getMyEVENTS(0).success(function(response) {
    vm.events = response;
    _.each(vm.events, function(event){
      event.startsAt = new Date(event.startsAt);
      event.banner = event.banner || 'img/default.png';
    });
  });
  vm.showEvent = function(id){
    $state.go('nav.showEvent/:id', {id: id});
    $ionicHistory.nextViewOptions({disableBack: false, historyRoot:false});
  };
  myEventsService.getMyEVENTSCount().success(function(response){
    vm.eventsCount = response;
    $ionicLoading.hide();
  });
  vm.loadMore = function(){
    myEventsService.getMyEVENTS(vm.events.length).success(function(response){
      _.each(response,function(event){
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

  vm.showSearch = function(){
    vm.show = !vm.show;
  };
}
