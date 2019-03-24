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
  function getRelatedDocuments(documentId) {
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'documento/'+documentId+'/relacionados', {data: ''});
  }
  function save(document) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'documento', document);
  }
  function update(id, document) {
    httpService.setHeaders();
    return $http.put(configService.getUrlServer() + 'documento/'+id, document);
  }
  function remove(document) {
    httpService.setHeaders();
    return $http.delete(configService.getUrlServer() + 'documento/'+document.id, {data: ''});
  }
  function restore(document) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'documento/restore/'+document.id, {data: ''});
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

  function removeVersion(documentId,versionId) {
    httpService.setHeaders();
    return $http.delete(configService.getUrlServer() + 'documento/'+documentId+'/version/'+versionId, {data: ''});
  }

  function getUsersToShare(document){
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'documento/compartir/alumnos/' + document.id , {data: ''});
  }

  function addUserShare(documentId, alumnoId){
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'documento/shared/'+documentId+'/alumno/'+alumnoId, {data: ''});
  }
  function removeUserShare(documentId, alumnoId){
    httpService.setHeaders();
    return $http.delete(configService.getUrlServer() + 'documento/shared/'+documentId+'/alumno/'+alumnoId, {data: ''});
  }

  function checkFollow(id){
    httpService.setHeaders();
    return $http.get(configService.getUrlServer() + 'documento/follow/' + id, {data: ''});
  }
  return {
    getById: getById,
    getAllByFilters: getAllByFilters,
    save: save,
    update: update,
    addFileToDocument: addFileToDocument,
    download: download,
    getComments: getComments,
    getRelatedDocuments: getRelatedDocuments,
    remove: remove,
    restore: restore,
    removeVersion: removeVersion,
    getUsersToShare: getUsersToShare,
    addUserShare: addUserShare,
    removeUserShare: removeUserShare,
    checkFollow: checkFollow
  }
    ;
});
