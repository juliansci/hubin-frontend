'use strict';

angular.module('hubinFrontendApp').service('reportService', function (configService, $http, httpService) {
  function save(report) {
    httpService.setHeaders();
      return $http.post(configService.getUrlServer() + 'denuncia', report);
  }

  return {
    save: save
  }
    ;
});
