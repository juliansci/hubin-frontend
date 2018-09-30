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
    'ngTouch',
    'toastr',
    'pascalprecht.translate'
  ])
  .config(function ($routeProvider, $httpProvider, $locationProvider, $translateProvider) {
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
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'search'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(false).hashPrefix('');
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/locale-',
      suffix: '.json'
    })
      .useSanitizeValueStrategy('escape')
      .preferredLanguage('es');
  })
  .run(function ($rootScope, $location, $http, $timeout, configService, securityService, sessionService) {
    $rootScope.$on('$routeChangeStart', function (event) {
      var logged = securityService.isLogged();
      if (!logged) {
        var restrictedUrls = securityService.getRestrictedUrls();
        console.log(restrictedUrls);
        console.log($location.path());
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
    $rootScope.urlServerBase = configService.getUrlServer();
  });


;
