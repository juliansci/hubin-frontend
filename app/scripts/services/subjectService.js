'use strict';

angular.module('hubinFrontendApp').service('subjectService', function (configService, $http, httpService) {
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'materia', {data: ''});
  }

  return {
    getAll: getAll
  }
    ;
});
