angular.module('app').controller('locationController', locationController);

locationController.$inject = [
  '$ionicLoading',
  'showEventsService',
  '$ionicPopup',
  '$scope',
  'loginService',
  '$state'
];
function locationController($ionicLoading, showEventsService, $ionicPopup, $scope, loginService, $state){
  var vm = this;
  vm.event = $state.params.evt;
  var master = angular.copy(vm.event);
  vm.type = true;
  vm.before = vm.event.startsAt.getTime() > new Date().getTime();
  vm.size = {'height' : '100%'};

  initialize();

  vm.editLocation = function(){
    if (vm.type) {
      vm.type = false;
      vm.marker.setOptions({draggable: true});
    }else{
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmar cambios',
        cancelText: 'No',
        okText: 'Sí',
      });
      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({'duration': 10000});
          showEventsService.setLocation(vm.event.id,vm.marker.getPosition().lat(),vm.marker.getPosition().lng()).success(function(response){
            vm.event.lat = vm.marker.getPosition().lat();
            vm.event.lng = vm.marker.getPosition().lng();
            $ionicLoading.hide();
            $ionicLoading.show({template: 'Actualizado', duration: 2000});
            vm.marker.setOptions({draggable: false});
            vm.type = true;
          }).error(function(){
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error',
              template: 'Edición no realizada. Chequea tu conexión a internet',
            }).then(function(){
            });
          });
        }else{
        }
      });
    }
  };

  vm.isOrganizer = function(){
    return _.contains(vm.event.organizers, loginService.getCurrent().id);
  };

  vm.reset = function(){
    angular.copy(master,vm.event);
  };

  function initialize(){
    var latLng = new google.maps.LatLng(vm.event.lat, vm.event.lng);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      panControl: false,
      zoomControl: false,
      streetViewControl: false,
      draggable : true,
      overviewMapControl: false,
      styles: [
        {
          "stylers":[
            {"hue":"#ff1a00"},
            {"invert_lightness":true},
            {"saturation":-100},
            {"lightness":33},
            {"gamma":0.5}
          ]
        },
        {
          "featureType":"water",
          "elementType":"geometry",
          "stylers":[
            {"color":"#2D333C"}
          ]}
        ]
      };

      vm.mapModal = new google.maps.Map(document.getElementById("mapModal"), mapOptions);
      vm.marker = {};

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(vm.mapModal, 'idle', function(){
        vm.marker = new google.maps.Marker({
          map: vm.mapModal,
          animation: google.maps.Animation.DROP,
          draggable:false,
          position: latLng
        });
        google.maps.event.addListener(vm.marker, 'click', function () {
          var infoWindow = new google.maps.InfoWindow({
            content: "Aquí sale Junt@da"
          });
          infoWindow.open(vm.mapModal, vm.marker);
        });
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      vm.mapModal.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      vm.mapModal.addListener('bounds_changed', function() {
        searchBox.setBounds(vm.mapModal.getBounds());
      });

      var markers = [];
      // [START region_getplaces]
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        vm.marker.setMap(null);

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          // Create a marker for each place.
          vm.marker = new google.maps.Marker({
            map: vm.mapModal,
            title: place.name,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            draggable:true
          });

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        vm.mapModal.fitBounds(bounds);
      });
    }
  }
