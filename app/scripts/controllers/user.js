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
    userService.getUser(user.id).then(function (response) {
      $scope.userProfile = response.data;
    }).catch(function (data) {
      console.log(data);
    })
    $('.js-edit-profile').on('click', function () {
      $(this).addClass('not-show');
      $('.js-user-username').editable({
        type: 'text',
        pk: 3,
        title: 'Enter username'
      });
      $('.js-user-name').editable({
        type: 'text',
        pk: 3,
        title: 'Enter name'
      });
      $('.js-user-email').editable({
        type: 'text',
        pk: 3,
        title: 'Enter email'
      });
      $('.js-user-description').editable({
        type: 'text',
        pk: 3,
        title: 'Enter description'
      })
    });

  });
