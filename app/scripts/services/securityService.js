'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.securityService
 * @description
 * # securityService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('securityService', function ($http, configService, sessionService) {

    var login = function (loginData) {
        sessionService.setSession(loginData);
        return $http.post(configService.getUrlServer() + 'alumno/login/', loginData).then(function (result) {
            return result;
        });
    };

    var register = function (registerData) {
        return $http.post(configService.getUrlServer() + 'alumno/', registerData).then(function (result) {
            return result;
        });
    };


    var getRestrictedUrls = function () {
        return  ['/home'];
    };

    var isLogged = function () {
        var user = sessionService.getItem('user');
        return (user !== null);
    };

    var getUser = function () {
        var strUser = sessionService.getItem('user');
        return JSON.parse(strUser);
    };

    return {
        getRestrictedUrls: getRestrictedUrls,
        isLogged: isLogged,
        login: login,
        register: register,
        getUser: getUser
    };
});
