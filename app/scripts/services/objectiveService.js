'use strict';

angular.module('hubinFrontendApp').service('objectiveService', function (configService, $http, httpService) {

  function getAll() {
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'objetivo/', {data: ''});
  }

  function getAllUser(userId) {
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'objetivo/alumno/' + userId, {data: ''});
  }

  return {
    getAll: getAll,
    getAllUser: getAllUser
  }
    ;
});
