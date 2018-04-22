'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.configService
 * @description
 * # configService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('configService', function () {

    var urlServerBase = 'http://localhost:8085/hubin/';

    return {
        getUrlServer: function () {
            return urlServerBase;
        }
    };
});
