'use strict';

angular.module('hubinFrontendApp').service('entityService', function (configService, $http, httpService) {
  function getById(id) {
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'entidad/' + id, {data: ''});
  }
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'entidad', {data: ''});
  }

  return {
    getById: getById,
    getAll: getAll
  }
    ;
});
