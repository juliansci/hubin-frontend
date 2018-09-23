'use strict';

angular.module('hubinFrontendApp').service('languageService', function (configService, $http, httpService) {
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'idioma', {data: ''});
  }

  return {
    getAll: getAll
  }
    ;
});
