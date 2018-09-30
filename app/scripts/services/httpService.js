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
    $http.defaults.headers.patch['Content-Type'] = 'application/json; charset=utf-8';
    $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $http.defaults.headers.put['Content-Type'] = 'application/json; charset=utf-8';
    console.log($http.defaults.headers.common['Authorization']);
  };
  var setHeadersMultipart = function () {
    var token = sessionService.getItemSession('token');
    $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
    delete $http.defaults.headers.common['Content-Type'];
    delete $http.defaults.headers.patch['Content-Type'];
    delete $http.defaults.headers.post['Content-Type'];
    delete $http.defaults.headers.put['Content-Type'];
  };
  return {
    setHeaders: setHeaders,
    setHeadersMultipart: setHeadersMultipart
  };
});
