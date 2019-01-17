'use strict';

angular.module('hubinFrontendApp').service('commentService', function (configService, $http, httpService) {

  function create(comment) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'comentario', comment);
  }
  return {
    create: create
  }
    ;
});
