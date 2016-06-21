angular.module('app').controller('newEventLocationController', newEventLocationController);

newEventLocationController.$inject = [
  '$ionicLoading',
  '$scope',
  '$state',
  'newEventService',
  'loginService',
  '$ionicHistory'
];
function newEventLocationController($ionicLoading, $scope, $state, newEventService, loginService, $ionicHistory){
  var vm = this;
  vm.event = $state.params.evt;
  vm.size = {'height' : '100%'};

  newEventService.getPosition()
  .then(function(position){
		initializeMap(position.coords.latitude, position.coords.longitude);
	}, function(err) {
		// error, por alguna razon no se obtuvo posicion alguna del usuario entonces lo mando a paysandú innova
		initializeMap('-32.317823','-58.0875532');
	});

  function initializeMap(latitude,longitude){
		var latLng = new google.maps.LatLng(latitude,longitude);
		var mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scaleControl: false,
			scrollwheel: false,
			panControl: false,
      zoomControl: false,
      mapTypeControl: false,
			streetViewControl: false,
			draggable : true,
			overviewMapControl: false,
			styles: [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
		};
		vm.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		vm.marker = {};
		//Wait until the map is loaded
		google.maps.event.addListenerOnce(vm.map, 'idle', function(){
			vm.marker  = new google.maps.Marker({
				map: vm.map,
				animation: google.maps.Animation.DROP,
				draggable:true,
				position: latLng
			});
			google.maps.event.addListener(vm.marker , 'click', function () {
				var infoWindow = new google.maps.InfoWindow({
					content: "Aquí sale Junt@da"
				});
				infoWindow.open(vm.map, vm.marker);
			});
		});

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    vm.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    vm.map.addListener('bounds_changed', function() {
      searchBox.setBounds(vm.map.getBounds());
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
          map: vm.map,
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
      vm.map.fitBounds(bounds);
    });
	}

  vm.save = function(){
		$ionicLoading.show({'duration': 10000});
        vm.event.startsAt.setUTCHours(vm.event.startsAt.getUTCHours() - 3);
        vm.event.endsAt.setUTCHours(vm.event.endsAt.getUTCHours() - 3);
		var data = JSON.stringify({
			event:{
				name:vm.event.name,
				description:vm.event.description,
				contentControl:false,
				private:vm.event.private,
				price:vm.event.price,
				startsAt:vm.event.startsAt,
				endsAt:vm.event.endsAt,
				creator_id: loginService.getCurrent().id,
				lat: vm.marker.getPosition().lat(),
				lng: vm.marker.getPosition().lng(),
				banner: vm.event.banner
			}
		});

		newEventService.create(data)
    .success(function(response){
			$ionicLoading.hide();
      $scope.$emit('addEvent');
      $ionicHistory.nextViewOptions({disableBack:true});
      $ionicLoading.show({template: 'Evento creado', duration: 3000}).then(function(){
        $state.go('nav.myEvents');
      });
		})
    .error(function(){
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Error',
				template: 'No se pudo crear el evento. Chequea tu conexión a internet',
				okType: 'button button-assertive'
			});
		});

	};

  }
