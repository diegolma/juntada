angular.module('app')
.factory('pushService', pushService);

pushService.$inject = [
  '$http',
  '$ionicPlatform',
  '$cordovaLocalNotification'
];
function pushService($http, $ionicPlatform, $cordovaLocalNotification) {
  var push;
  return {
    init : function(id){
      $ionicPlatform.ready(function() {
        push = PushNotification.init({
          "android": {
            "senderID": "613037736244"
          },
          "ios": {"alert": "true", "badge": "true", "sound": "true"},
          "windows": {}
        });

        push.on('registration', function(data) {
          //console.log("registration event");
          //console.log(JSON.stringify(data));
          if(id)
            return $http.put(BASE_URL + 'users/' + id + '/push', data.registrationId);
        });

        push.on('notification', function(data) {
          //console.log("notification event");
          //console.log(JSON.stringify(data));
          $cordovaLocalNotification.schedule({
            title: data.title,
            text: data.message
          });
          push.finish(function () {
            //console.log('finish successfully called');
          });
        });

        push.on('error', function(e) {
          //console.log("push error");
        });
      });
    },
    stop : function(id){
      $ionicPlatform.ready(function() {
        push.unregister(function() {
          //console.log('success');
          return $http.put(BASE_URL + 'users/' + id + '/push', 0);
        }, function() {
          //console.log('error');
        });
      });
    }
  };
}
