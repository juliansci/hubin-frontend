'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.httpService
 * @description
 * # httpService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('httpService', function ($http, sessionService) {

  var setHeaders = function () {
    var token = sessionService.getItemSession('token');
    $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
    $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    console.log($http.defaults.headers.common);
  };

  return {
    setHeaders: setHeaders
  };
});
