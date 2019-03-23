'use strict';

angular.module('hubinFrontendApp').service('notificationService', function (configService, $http, httpService) {
  function getAll() {
    httpService.setHeaders();
      return $http.get(configService.getUrlServer() + 'alumno/notificaciones', {data: ''});
  }
  function markAsRead(notification) {
    httpService.setHeaders();
    return $http.post(configService.getUrlServer() + 'alumno/notificaciones/leida/'+notification.id, {data: ''});
  }
  return {
    getAll: getAll,
    markAsRead: markAsRead
  }
    ;
});
