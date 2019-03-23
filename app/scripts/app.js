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
    'pascalprecht.translate',
    'ui.bootstrap'
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
      .when('/user/:id', {
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

      .when('/document/new', {
        templateUrl: 'views/documentEdit.html',
        controller: 'DocumentEditCtrl',
        controllerAs: 'documentEdit'
      })
      .when('/document/edit/:id', {
        templateUrl: 'views/documentEdit.html',
        controller: 'DocumentEditCtrl',
        controllerAs: 'documentEdit'
      })
      .when('/document/:id', {
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
                 entityService, subjectService, levelService, languageService, userService, notificationService) {
    $rootScope.$on('$routeChangeStart', function (event) {
      var logged = securityService.isLogged();
      if (!logged) {
        var restrictedUrls = securityService.getRestrictedUrls();
        var urlFind = restrictedUrls.find(function (element) {
          return $location.path().includes(element);
        });
        if (urlFind !== undefined) {
          return $location.path('/login');
        }
      }
      if ($rootScope.user !== null && $rootScope.entities === undefined) {
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

        var promiseScores = userService.getScores().then(function (response) {
          return response.data;
        });
        promises.push(promiseScores);
        $q.all(promises).then(function (res) {
          $rootScope.entities = res[0];
          $rootScope.subjects = res[1];
          $rootScope.levels = res[2];
          $rootScope.languages = res[3];
          $rootScope.scores = res[4];
          $rootScope.entitiesLoaded = true;
        });

      }
      console.log($rootScope.user);
      console.log($rootScope.notificationTimeout);
      $rootScope.quantNewNotifications = 0;
      if ($rootScope.user !== null && $rootScope.notificationTimeout === undefined) {
        getNotifications();
        $rootScope.notificationTimeout = setInterval(function () {
          getNotifications();
          var dontReadNotifications = $rootScope.notifications.filter(function (notification) {
            return !notification.leido;
          });
          $rootScope.quantNewNotifications = dontReadNotifications.length;
        }, 5000);
      }
      if ($rootScope.user === null && $rootScope.notificationTimeout !== undefined) {
        clearInterval($rootScope.notificationTimeout);
      }
    });

    function getNotifications() {
      notificationService.getAll()
        .then(function (response) {
          $rootScope.notifications = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    $rootScope.user = securityService.getUser();
    $rootScope.logout = function () {
      sessionService.clearSession();
      $rootScope.user = null;
      clearInterval($rootScope.notificationTimeout);
      $location.path('/');
    };
    $rootScope.changeLanguage = function (lang) {
      $translate.use(lang);
    };
    $rootScope.isActive = function (path) {
      var active = (path === $location.path());
      return active;
    };
    $rootScope.markAsRead = function ($event, notification) {
      if (!notification.leido) {
        notificationService.markAsRead(notification).then(function (response) {
          $($event.currentTarget).removeClass('active');
          $rootScope.quantNewNotifications--;
          console.log('response mark as read: ', response);
        })
          .catch(function (error) {
            console.log(error);
          });
      }

    };
    $rootScope.closeNotifications = function () {
      $('.js-list-notifications').toggle();
    }
    $rootScope.urlServerBase = configService.getUrlServer();
    $rootScope.entitiesLoaded = false;
  });
