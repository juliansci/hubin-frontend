'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.userService
 * @description
 * # userService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('userService', function (configService, $http, httpService) {
  return {
    getDocuments: function (id) {
      httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'usuario/documentos/' + id).then(function (result) {
        return result;
      });
    },
    getUser: function (id) {
      httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'alumno/' + id, {data: ''}).then(function (result) {
        console.log(result);
        return result;
      });
    }
  };

});
