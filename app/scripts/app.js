'use strict';
/**
 * @ngdoc overview
 * @name hubinFrontendApp
 * @description
 * # hubinFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('hubinFrontendApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/registro', {
        templateUrl: 'views/registro.html',
        controller: 'RegistroCtrl',
        controllerAs: 'registro'
      })
      .when('/logout', {
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(false).hashPrefix('');

  })
  .run(function ($rootScope, $location, $http, $timeout, configService, securityService, sessionService) {
    if ($rootScope.globals && $rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.$on('$routeChangeStart', function (event) {
      var logged = securityService.isLogged();
      if (!logged) {
        var restrictedUrls = securityService.getRestrictedUrls();
        if (restrictedUrls.indexOf($location.path()) >= 0) {
          $location.path('/login');
        }
      }
    });
    $rootScope.user = securityService.getUser();

    $rootScope.logout = function () {
      sessionService.clearSession();
      $rootScope.user = null;
      $location.path('/');
    };

    $rootScope.isActive = function (path) {
      var active = (path === $location.path());
      return active;
    };


  });


;
