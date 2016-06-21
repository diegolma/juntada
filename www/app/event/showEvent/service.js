angular.module('app')
.factory('showEventsService', showEventsService);

showEventsService.$inject = [
    'loginService',
    '$http'
];
function showEventsService(loginService, $http){
    return {
        setLocation: setLocation,
        setOrganizers: setOrganizers,
        setGuests: setGuests,
        uploadBanner: uploadBanner,
        getEvent: getEvent,
        createContent: createContent,
        cancel: cancel,
        addPartaker: addPartaker,
        removePartaker: removePartaker,
        getContents: getContents
    };

    function setLocation(event_id, newLat, newLng){
        var data = JSON.stringify({'newLat' : newLat,'newLng' : newLng});
        return $http.put(BASE_URL + 'events/'+event_id+'/location',data);
    }
    function setOrganizers(event_id, organizers, noOrganizers){//amazin mnemotechnycal parameters names
        var data = JSON.stringify([organizers,noOrganizers]);
        return $http.post(BASE_URL+'events/'+event_id+'/organizers', data);
    }
    function setGuests(event_id, invitados, noInvitados){
        var data = JSON.stringify([invitados,noInvitados]);
        return $http.post(BASE_URL+'events/'+event_id+'/guests', data);
    }
    function uploadBanner(id, data){
        return $http.post(BASE_URL + 'events/' + id + '/loadB', data);
    }
    function getEvent(id){
        return $http.get(BASE_URL + 'events/' + id);
    }
    function createContent(data){
        return $http.post(BASE_URL + 'contents', data);
    }
    function cancel(id){
        return $http.delete(BASE_URL+'/events/'+id);
    }
    function addPartaker(event_id, user_id){
        var data = JSON.stringify({id:user_id});
        return $http.post(BASE_URL+'events/'+event_id+'/willgo', data);
    }
    function removePartaker(event_id, user_id) {
        var data = JSON.stringify({id:user_id});
        return $http.post(BASE_URL+'events/'+event_id+'/willnotgo', data);
    }
    function getContents(event_id, since) {
        return $http.get(BASE_URL + 'events/'+event_id+'/contents/'+since);
    }
}
