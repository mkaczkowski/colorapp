'use strict';

// Declare app level module which depends on filters, and services
angular.module('colorappApp.config', [])

  .constant('version', '0.8.2')
  .constant('loginRedirectPath', '/login')
  .constant('FBURL', 'https://scorching-inferno-5757.firebaseio.com/colorapp')
  .run(['FBURL', '$timeout', function(FBURL, $timeout) {
    if( FBURL.match('//INSTANCE.firebaseio.com') ) {
      angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
      $timeout(function() {
        angular.element(document.body).removeClass('hide');
      }, 250);
    }
  }]);

