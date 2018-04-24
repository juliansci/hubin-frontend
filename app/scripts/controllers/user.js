'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('UserCtrl', function ($rootScope, $scope, $location, userService, securityService) {
    var user = securityService.getUser();
    userService.getUser(user.id).then(function (data) {
      console.log(data);
    }).catch(function (data) {
      console.log(data);
    })

  });
