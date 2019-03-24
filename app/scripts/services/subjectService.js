'use strict';

angular.module('hubinFrontendApp').service('subjectService', function (configService, $http, httpService) {
  function getById(id) {
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'materia/' + id, {data: ''});
  }
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'materia', {data: ''});
  }
  function getAllOutstanding() {
    httpService.setHeadersNotLogged();
    return $http.get(configService.getUrlServer() + 'materia/destacadas', {data: ''});
  }
  function checkFollow(id){
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'materia/follow/' + id, {data: ''});
  }

  return {
    getById: getById,
    getAll: getAll,
    getAllOutstanding: getAllOutstanding,
    checkFollow: checkFollow
  }

});
