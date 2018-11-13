'use strict';

angular.module('hubinFrontendApp').service('scoreService', function (configService, $http, httpService) {

  function save(score) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'puntuacion', score);
  }



  return {
    save: save
  }
    ;
});
