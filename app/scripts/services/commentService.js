'use strict';

angular.module('hubinFrontendApp').service('commentService', function (configService, $http, httpService) {

  function create(comment) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'comentario', comment);
  }
  function createSubject(comment) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'comentario/materia', comment);
  }
  function createEntity(comment) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'comentario/entidad', comment);
  }
  return {
    create: create,
    createSubject: createSubject,
    createEntity: createEntity

  }
    ;
});
