'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('UserCtrl', function ($rootScope, $scope, $location, $http, userService, securityService, toastr) {

    $scope.onEditProfile = false;

    var user = securityService.getUser();
    userService.getUser(user.id).then(function (response) {
      $scope.userProfile = response.data;
      console.log($scope.userProfile);
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
          presentacion: description
        };
        userService.updateUser(user.id, profileUpdate).then(function (response) {
          $scope.userProfile = response.data;
        }).catch(function (data) {
          console.log(data);
        });
      }

    });
    $('.js-image-user').on('mouseenter', function () {
      $('.js-edit-image').addClass('visible');
    });
    $('.js-image-user').on('mouseleave', function () {
      $('.js-edit-image').removeClass('visible');
    });
    $('.js-edit-image').on('click', function () {
      $('.js-add-image').click();
    })
    $('.js-add-image').on('change', function () {
      var input = this;
      var $input = $(this);
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var imagen = e.target.result;
          console.log(e.target);
          $input.parents('.js-img-profile').attr('src', imagen);
          sendImageAjax($input, true, imagen);
        };
        reader.readAsDataURL(input.files[0]);
      }
    });

    function sendImageAjax($input, imagen) {
      var form = $input.parents('form');
      var formData = new FormData(form[0]);
      var action = $rootScope.urlServerBase + form.attr('action');
      userService.addImageProfile(action, formData).then(function successCallback(response) {
        if (response.status !== 200) {
          toastr.error('Ha ocurrido un error. Intente luego.');
        } else {
          if (response.data.foto && response.data.foto.base64Src) {
            $('.js-img-profile').attr('src', response.data.foto.base64Src);
            toastr.success("Imagen actualizada correctamente!");
          }
        }
      }, function errorCallback(error) {
        toastr.error('Ha ocurrido un error. Intente luego.');
      });
    }

  });
