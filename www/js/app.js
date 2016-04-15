// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
// kick off the platform web client
Ionic.io();

Ionic.Auth.signup(user).then(signupSuccess, signupFailure);
var options = { 'remember': true };
Ionic.Auth.login('basic', options, details).then(authSuccess, authFailure);


// this will give you a fresh user or the previously saved 'current user'
var user = Ionic.User.current();

// if the user doesn't have an id, you'll need to give it one.
if (!user.id) {
  user.id = Ionic.User.anonymousId();
  // user.id = 'your-custom-user-id';
}

var push = new Ionic.Push({});

push.register(function(token) {
  // Log out your device token (Save this!)
  console.log("Got Token:",token.token);
});



    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'ctrlBundeslandauswahl'
        }
      }
    })

    .state('app.bundesland', {
      url: '/bundesland',
      views: {
        'menuContent': {
          templateUrl: 'templates/bundesland.html',
          controller: 'ctrlBundesland'
        }
      }
    })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'FeedController'
        }
      }
    })

.state('app.neuewarnungen', {
      url: '/neuewarnungen',
      views: {
        'menuContent': {
          templateUrl: 'templates/neuewarnungen.html',
          controller: 'ctrlNeue'
        }
      }
    })


  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
