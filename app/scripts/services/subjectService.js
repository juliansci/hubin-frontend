'use strict';

angular.module('hubinFrontendApp').service('subjectService', function (configService, $http, httpService) {
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'materia', {data: ''});
  }
  function getAllOutstanding() {
    httpService.setHeadersNotLogged();
    return $http.get(configService.getUrlServer() + 'materia/destacadas', {data: ''});
  }
  return {
    getAll: getAll,
    getAllOutstanding: getAllOutstanding
  }
    ;
});
