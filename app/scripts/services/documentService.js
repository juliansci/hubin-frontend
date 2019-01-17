'use strict';

angular.module('hubinFrontendApp').service('documentService', function (configService, $http, httpService) {
  function getById(id) {
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'documento/' + id , {data: ''});
  }
  function getAllByFilters(filters) {
    httpService.setHeaders();
    var params = generateQueryParams(filters);
    return $http.get(configService.getUrlServer() + 'documento' + params, {data: ''});
  }

  function save(document) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'documento', document);
  }
  function update(id, document) {
    httpService.setHeaders();
    return $http.put(configService.getUrlServer() + 'documento/'+id, document);
  }

  function addFileToDocument(data, documentId) {
    httpService.setHeadersMultipart();
    return $http({
      url: configService.getUrlServer() + 'documento/' + documentId + '/version',
      data: data,
      processData: false,
      contentType: undefined,
      method: 'POST'
    });
  }

  function download(documentId, versionId){
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'documento/'+documentId + '/version/' + versionId, {data: ''});
  }

  function generateQueryParams(params) {
    var paramsStr = '';
    var i = 0;
    for (var key in params) {
      var currentValue = params[key];
      if (i == 0) {
        paramsStr += '?' + key + '=' + currentValue;
      } else {
        paramsStr += '&' + key + '=' + currentValue;
      }
      i++;
    }
    return paramsStr;
  }

  function getComments(documentId){
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'documento/'+documentId + '/comentarios', {data: ''});
  }

  return {
    getById: getById,
    getAllByFilters: getAllByFilters,
    save: save,
    update: update,
    addFileToDocument: addFileToDocument,
    download: download,
    getComments: getComments
  }
    ;
});
