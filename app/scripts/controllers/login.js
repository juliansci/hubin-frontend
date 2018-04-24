'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $location, securityService, sessionService) {
    $('#loginForm').on('submit', function () {
      var userError = $(this).find('.js-user-error');
      var passwordError = $(this).find('.js-password-error');
      var formError = $(this).find('.js-form-error');
      userError.text('');
      passwordError.text('');
      var user = $(this).find('.js-user').val();
      var password = $(this).find('.js-password').val();
      var userErrorText = "Ingrese un usuario";
      var passwordErrorText = "Ingrese un password";
      if (user === '') {
        userError.text(userErrorText);
        return false;
      }
      if (password === '') {
        passwordError.text(passwordErrorText);
        return false;
      }
      var loginData = {
        username: user,
        password: password
      };
      securityService.login(loginData).then(function (response) {
        if (response.status === 200) {
          var user = response.data;
          sessionService.setItemSession('user', user);
          $rootScope.user = securityService.getUser();
          $location.path('/home');
          return;
        } else {
          sessionService.clearSession();
          formError.text(response.data.message);
          return;
        }


      }, function (response) {
        console.log(response);
        sessionService.clearSession();
        if (response.data && response.data.message) {
          formError.text(response.data.message);
        } else {
          formError.text('Ha ocurrido un error. Intente luego.');
        }
        return;
      });
      return false;
    });

    $('.js-login-fb').on('click', function () {
      FB.login(function (response) {
        if (response.status === 'connected') {
          FB.api('/me/?fields=id,email', function (user) {
            var loginData = {
              username: user.email,
              password: user.id
            };
            securityService.login(loginData).then(function (response) {
              var user = response.data;
              sessionService.setItemSession('user', user);
              $rootScope.user = securityService.getUser();
              $location.path('/home');
              return;
            }, function () {
              var registerData = {
                username: user.email,
                email: user.email,
                password: user.id
              };
              sessionService.clearSession();
              securityService.register(registerData).then(function (response) {
                sessionService.setItemSession('user', response.data);
                $rootScope.user = securityService.getUser();
                $location.path('/');
              });

            });
          });
        }
      }, {scope: 'email'});
    });
  });
