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
      .when('/entity/:id', {
        templateUrl: 'views/entity.html',
        controller: 'EntityCtrl',
        controllerAs: 'entity'
      })
      .when('/subject/:id', {
        templateUrl: 'views/subject.html',
        controller: 'SubjectCtrl',
        controllerAs: 'subject'
      })
      .when('/document', {
        templateUrl: 'views/document.html',
        controller: 'DocumentCtrl',
        controllerAs: 'document'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(false).hashPrefix('');
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/locale-',
      suffix: '.json'
    })
      .useSanitizeValueStrategy(null)
      .preferredLanguage('es');
  })
  .run(function ($rootScope, $location, $http, $timeout, $translate, $q, configService, securityService, sessionService,
                 entityService, subjectService, levelService, languageService) {
    $rootScope.$on('$routeChangeStart', function (event) {
      var logged = securityService.isLogged();
      if (!logged) {
        var restrictedUrls = securityService.getRestrictedUrls();
        var urlFind = restrictedUrls.find(function(element) {
          return $location.path().includes(element);
        });
        if (urlFind  !== undefined) {
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
    $rootScope.changeLanguage = function(lang){
      $translate.use(lang);
    };
    $rootScope.isActive = function (path) {
      var active = (path === $location.path());
      return active;
    };
    $rootScope.urlServerBase = configService.getUrlServer();
    $rootScope.entitiesLoaded = false;
    if ($rootScope.user !== undefined && $rootScope.entities === undefined) {
      $rootScope.entities = [];
      $rootScope.subjects = [];
      $rootScope.levels = [];
      $rootScope.languages = [];
      var promises = [];
      var promiseEntities = entityService.getAll().then(function (response) {
        return response.data;
      });
      promises.push(promiseEntities);
      var promiseSubjects = subjectService.getAll().then(function (response) {
        return response.data;
      });
      promises.push(promiseSubjects);

      var promiseLevels = levelService.getAll().then(function (response) {
        return response.data;
      });
      promises.push(promiseLevels);

      var promiseLanguages = languageService.getAll().then(function (response) {
        return response.data;
      });
      promises.push(promiseLanguages);
      $q.all(promises).then(function (res) {
        $rootScope.entities = res[0];
        $rootScope.subjects = res[1];
        $rootScope.levels = res[2];
        $rootScope.languages = res[3];
        $rootScope.entitiesLoaded = true;
      });
    }
  });
