'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.securityService
 * @description
 * # securityService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('securityService', function ($http, configService, sessionService) {

  var login = function (user) {
    sessionService.setAuthentication(user);
    return $http.post(configService.getUrlServer() + 'alumno/login/', user).then(function (result) {
      console.log(result);
      return result;
    });
  };

  var register = function (registerData) {
    return $http.post(configService.getUrlServer() + 'alumno/', registerData).then(function (result) {
      return result;
    });
  };


  var getRestrictedUrls = function () {
    return ['/home', '/user', '/search'];
  };

  var isLogged = function () {
    var token = sessionService.getItemSession('token');
    return (token !== null);
  };

  var getUser = function () {
    return sessionService.getItemSession('user');
  };

  return {
    getRestrictedUrls: getRestrictedUrls,
    isLogged: isLogged,
    login: login,
    register: register,
    getUser: getUser
  };
});
