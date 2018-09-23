'use strict';

angular.module('hubinFrontendApp').service('documentService', function (configService, $http, httpService) {
  function getAllByFilters(filters) {
    httpService.setHeaders();
    var params = generateQueryParams(filters);
      return $http.get(configService.getUrlServer() + 'documento' + params, {data: ''});
  }

  function generateQueryParams(params){
    var paramsStr = '';
    var i = 0;
    for(var key in params){
      var currentValue = params[key];
      if(i == 0){
        paramsStr += '?' + key + '=' + currentValue;
      }else{
        paramsStr += '&' + key + '=' + currentValue;
      }
      i++;
    }
    return paramsStr;
  }
  return {
    getAllByFilters: getAllByFilters
  }
    ;
});
