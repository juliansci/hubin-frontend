'use strict';

angular.module('hubinFrontendApp').service('entityService', function (configService, $http, httpService) {
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'entidad', {data: ''});
  }

  return {
    getAll: getAll
  }
    ;
});
