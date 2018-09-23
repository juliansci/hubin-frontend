'use strict';

angular.module('hubinFrontendApp').service('levelService', function (configService, $http, httpService) {
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'nivel', {data: ''});
  }

  return {
    getAll: getAll
  }
    ;
});
