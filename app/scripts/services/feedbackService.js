'use strict';

angular.module('hubinFrontendApp').service('feedbackService', function (configService, $http, httpService) {
  function save(feedback) {
    httpService.setHeaders();
      return $http.post(configService.getUrlServer() + 'feedback', feedback);
  }

  return {
    save: save
  }
    ;
});
