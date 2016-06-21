angular.module('app')
.config(function($stateProvider, $urlRouterProvider) {

  /**
  Define here the user routes
  **/
  $stateProvider
  .state('nav',{
      url: '/side-menu21',
      templateUrl: 'app/shared/sidemenu/index.html',
      controller: 'navController',
      controllerAs: 'vm',
      abstract: true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'app/user/login/index.html',
    controller: 'loginController',
    controllerAs: 'vm'
  })
  .state('signup',{
    url: '/signup',
    templateUrl: 'app/user/signup/index.html',
    controller: 'signupController',
    controllerAs: 'vm'
  })
  .state('nav.profile', {
    url: '/profile',
    views:{
      'side-menu21':{
        templateUrl: 'app/user/profile/index.html',
        controller: 'profileController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.contacts', {
    url: '/contacts',
    views:{
      'side-menu21':{
        templateUrl: 'app/user/contacts/index.html',
        controller: 'contactsController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.myEvents', {
    url: '/myEvents',
    views:{
      'side-menu21':{
        templateUrl: 'app/event/myEvents/index.html',
        controller: 'myEventsController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.newEvent', {
    url: '/newEvent',
    views:{
      'side-menu21':{
        templateUrl: 'app/event/newEvent/index.html',
        controller: 'newEventController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.newEvent/location', {
    url: '/newEvent/location',
    params: {
      evt: null
    },
    views:{
      'side-menu21':{
        templateUrl: 'app/event/newEvent/location.html',
        controller: 'newEventLocationController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.events', {
    url: '/events',
    views:{
      'side-menu21':{
        templateUrl: 'app/event/events/index.html',
        controller: 'eventsController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.findEvent', {
    url: '/findEvent',
    views:{
      'side-menu21':{
        templateUrl: 'app/event/findEvent/index.html',
        controller: 'findEventController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.showEvent/:id', {
    cache: false,
    url: '/showEvent/:id',
    views:{
      'side-menu21':{
        templateUrl: 'app/event/showEvent/index.html',
        controller: 'showEventController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.options', {
    url: '/options',
    views:{
      'side-menu21':{
        templateUrl: 'app/shared/options/index.html',
        controller: 'optionsController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.addContact', {
    url: '/contacts/add',
    views:{
      'side-menu21':{
        templateUrl: 'app/user/contacts/add.html',
        controller: 'addContactController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.location', {
    url: '/showEvent/location',
    params: {
      evt: null
    },
    views:{
      'side-menu21':{
        templateUrl: 'app/event/showEvent/modals/location/index.html',
        controller: 'locationController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.edit', {
    url: '/showEvent/edit',
    params: {
      evt: null
    },
    views:{
      'side-menu21':{
        templateUrl: 'app/event/showEvent/modals/edit/index.html',
        controller: 'editController',
        controllerAs: 'vm'
      }
    }
  })
  .state('nav.list', {
    url: '/showEvent/list',
    params: {
      evt: null,
      listType: null
    },
    views:{
      'side-menu21':{
        templateUrl: 'app/event/showEvent/modals/list/index.html',
        controller: 'listController',
        controllerAs: 'vm'
      }
    }
  });

  //$urlRouterProvider.otherwise('/login');
});
