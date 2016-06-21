angular.module('app').controller('showEventController', showEventController);

showEventController.$inject = [
  '$ionicPlatform',
  '$scope',
  '$state',
  'contactsService',
  '$ionicLoading',
  '$ionicPopup',
  'showEventsService',
  'pictureService',
  'loginService',
  'md5',
  '$ionicScrollDelegate',
  '$timeout'
];
function showEventController($ionicPlatform, $scope, $state, contactsService, $ionicLoading, $ionicPopup, showEventsService, pictureService, loginService, md5, $ionicScrollDelegate, $timeout){
  var vm = this;

  vm.location = function(){
    $state.go("nav.location",{evt:vm.event});
  };

  vm.edit = function(){
    $state.go("nav.edit",{evt:vm.event});
  };

  vm.list = function(type){
    $state.go("nav.list",{evt:vm.event, listType: type});
  };

  vm.updateB = function(){
    if (vm.before && (vm.isOrganizer() || vm.creator)) {
      pictureService.custom(0).then(function(img){
        $ionicLoading.show({'duration': 10000});
        showEventsService.uploadBanner(vm.event.id,'data:image/jpeg;base64,' +img)
        .then(function(){
          $ionicLoading.hide();
          $ionicLoading.show({template: 'Actualizado', duration: 2000}).then(function(r) {
            vm.bannerBackground = 'data:image/jpeg;base64,' +img;
          });
        }).error(function(){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'Edición no realizada. Chequea tu conexión a internet',
            okType: 'button button-assertive'
          });
        });
      });
    }
  };

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $ionicLoading.show({'duration': 10000});
  });

  var id = $state.params.id;
  if(id){
    showEventsService.getEvent(id)
    .then(function(ev){
      ev = ev.data;
      $ionicLoading.hide();
      vm.event = ev.event;
      vm.event.startsAt = new Date(vm.event.startsAt);
      vm.event.endsAt = new Date(vm.event.endsAt);
      vm.priceLabel = vm.event.price === 0 ? 'Gratuito' : 'Precio $'+ vm.event.price;
      vm.during = vm.event.startsAt.getTime() < new Date().getTime() && new Date().getTime() < vm.event.endsAt.getTime();
      vm.before = vm.event.startsAt.getTime() > new Date().getTime();
      vm.after = new Date().getTime() > vm.event.endsAt.getTime();
      var user_id = loginService.getCurrent().id;
      vm.event.goVisible = !_.contains(vm.event.willGo, user_id);
      vm.event.notGoVisible = !_.contains(vm.event.willNotGo, user_id) && !_.contains(vm.event.organizers, user_id);
      vm.event.banner = vm.event.banner || 'img/default.png';
      vm.bannerBackground = {'background-image': 'url('+vm.event.banner+')'};
      _.each(vm.event.contents, function(content){
        var aux = content.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(content.email.toLowerCase()) + '?s=100';
        content.photo = {'background-image': 'url('+aux+')'};
      });
      vm.creator = vm.event.creator_id == loginService.getCurrent().id;
      vm.newContent = {};
      vm.fileFromCamera = function(){
        pictureService.custom(1).then(function(img){
          vm.showPic = true;
          vm.newContent.file = 'data:image/jpeg;base64,' + img;
        });
      };
      vm.fileFromGallery = function(){
        pictureService.custom(0).then(function(img){
          vm.showPic = true;
          vm.newContent.file = 'data:image/jpeg;base64,' + img;
        });
      };
      vm.showPic = false;
      vm.saveContent = function(){
        $ionicLoading.show({'duration': 10000});
        var data = {
          message: vm.newContent.message,
          file: vm.newContent.file,
          creator: loginService.getCurrent().nickname,
          creator_id: loginService.getCurrent().id,
          event_id: vm.event.id
        };
        showEventsService.createContent(JSON.stringify({content:data}))
        .success(function(response){
          //como mostramos los contenidos desde el más nuevo al más viejo, lo agrego al comienzo de la fila
          var aux = loginService.getCurrent().photo || 'http://www.gravatar.com/avatar/' + md5.createHash(loginService.getCurrent().email.toLowerCase()) + '?s=100';
          data.photo = {'background-image': 'url('+aux+')'};
          data.createdAt = new Date();
          vm.event.contents.unshift(data);
          //como agrego un contenido y luego uso la cantidad de contenidos para chequear si hay más contenidos para cargar con el scroll, debo aumentar la cantidad de contenidos
          vm.event.contentsCount += 1;
          //vacia los campos
          vm.showPic = false;
          vm.newContent.file = '';
          vm.newContent = {};
          //oculto el cartel de 'cargando'
          $ionicLoading.hide();
          $ionicLoading.show({template: 'Contenido publicado', duration: 2000});
        })
        .error(function(){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'Contenido no subido. Chequea tu conexión a internet',
            okType: 'button button-assertive'
          });
        });
      };
      vm.cancel = function(){
        var confirmPopup = $ionicPopup.confirm({
          title: 'Cancelar evento',
          template: '¿Está seguro que desea cancelar el evento?',
          okText: 'Sí',
          cancelText: 'No'
        });
        confirmPopup.then(function(res) {
          if(res) {
            showEventsService.cancel(vm.event.id)
            .then(function(){
              $scope.$emit('cancelEvent');
              $state.go('nav.events');
            });
          } else {}
        });
      };
      vm.isOrganizer = function(){
        return _.contains(vm.event.organizers, loginService.getCurrent().id);
      };
      vm.go = function(){
        vm.event.goVisible = false;
        vm.event.notGoVisible = true;
        showEventsService.addPartaker(vm.event.id, loginService.getCurrent().id).success(function(){
          $ionicLoading.show({template: 'Agregado a asistentes', duration: 2000});
        }).error(function(){
          $ionicPopup.alert({
            title: 'Error',
            template: 'Acción no realizada. Chequea tu conexión a internet',
            okType: 'button button-assertive'
          });
        });
      };
      vm.notGo = function(){
        vm.event.goVisible = true;
        vm.event.notGoVisible = false;
        showEventsService.removePartaker(vm.event.id, loginService.getCurrent().id).success(function(){
          $ionicLoading.show({template: 'Agregado a inasistentes', duration: 2000});
        }).error(function(){
          $ionicPopup.alert({
            title: 'Error',
            template: 'Acción no realizada. Chequea tu conexión a internet',
            okType: 'button button-assertive'
          });
        });
      };
      vm.formatDate = function(dateString){
        //dada una fecha y la actual te dice la diferencia
        var actual = new Date().getTime();
        var desde = new Date(dateString).getTime();
        var diff = Math.round(actual - desde)/1000;
        if (diff < 60) {
          return "hace un momento";
        }
        if (diff < 3600) {
          return "hace "+Math.round(diff/60)+" minutos";
        }
        if (diff < 86400) {
          return "hace "+Math.round(diff/3600)+" horas";
        }
        if (diff < 2678400) {
          return "hace "+Math.round(diff/86400)+" días";
        }
        return "hace mucho tiempo";
      };
      vm.loadMore = function(){
        showEventsService.getContents(vm.event.id,vm.event.contents.length)
        .then(function(response){
          response = response.data;
          _.each(response.contents,function(content){
            var aux = content.photo || 'http://www.gravatar.com/avatar/' + md5.createHash(content.email.toLowerCase()) + '?s=100';
            content.photo = {'background-image': 'url('+aux+')'};
            vm.event.contents.push(content);
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };
      vm.altura = function(item){
        if (item.file) {
          return '33%';
        }
        return '16%';
      };
      vm.moreData = function(){
        return vm.event.contents.length < vm.event.contentsCount;
      };
    });
  }
}
