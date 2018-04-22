'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.usuarioService
 * @description
 * # usuarioService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('usuarioService', function (configService, $http) {
    return {
        obtenerDocumentos: function (id) {
            return $http.get(configService.getUrlServer() + 'usuario/documentos/'+id).then(function (result) {
                return result;
            });
        },
        obtener: function (id) {
            return $http.get(configService.getUrlApiServer() + 'usuario/'+id).then(function (result) {
                return result;
            });
        }
    };

});
