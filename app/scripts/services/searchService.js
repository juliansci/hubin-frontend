'use strict';

/**
 * @ngdoc service
 * @name hubinFrontendApp.searchService
 * @description
 * # searchService
 * Service in the hubinFrontendApp.
 */
angular.module('hubinFrontendApp').service('searchService', function (configService, $http, httpService) {
  function formatParams(params) {
    var stringParams = '';
    var first = true;
    Object.keys(params).forEach(function (key) {
      stringParams += (first) ? '?' : '&';
      stringParams += key + '=' + params[key];
    });
    return stringParams;
  }

  return {
    search: function (params) {
      var stringParams = formatParams(params);
      httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'documento' + stringParams, {data: ''}).then(function (result) {
        return result;
      });
    }
  }
    ;
});
