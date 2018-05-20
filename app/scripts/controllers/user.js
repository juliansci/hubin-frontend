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

    $scope.onEditProfile = false;

    var user = securityService.getUser();
    userService.getUser(user.id).then(function (response) {
      $scope.userProfile = response.data;
    }).catch(function (data) {
      console.log(data);
    });

    $('.js-edit-profile').on('click', function () {
      $scope.$apply(function () {
        $scope.onEditProfile = !$scope.onEditProfile;
      });
      if ($scope.onEditProfile) {
        $('.js-user-name').editable({
          type: 'text',
          title: 'Ingrese su nombre'
        });
        $('.js-user-email').editable({
          type: 'text',
          title: 'Ingrese su email'
        });
        $('.js-user-description').editable({
          type: 'text',
          title: 'Ingrese una descripcion'
        });
      } else {
        $('.js-user-name, .js-user-email, .js-user-description').editable('destroy');
        var name = $('.js-user-name').text().trim();
        var email = $('.js-user-email').text().trim();
        var description = $('.js-user-description').text().trim();
        name = (name === 'Ingrese su nombre') ? '' : name;
        description = (description === 'Ingrese una descripcion') ? '' : description;
        email = (email === 'Ingrese su email') ? '' : email;
        var profileUpdate = {
          nombre: name,
          email: email,
          presentacion: description,
          password: '123456'
        };
        userService.updateUser(user.id, profileUpdate).then(function (response) {
          $scope.userProfile = response.data;
        }).catch(function (data) {
          console.log(data);
        });
      }

    });

  });
