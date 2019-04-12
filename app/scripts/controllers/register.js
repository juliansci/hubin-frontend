'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('RegisterCtrl', function ($rootScope, $scope, $location, securityService, sessionService) {

    $('#registerForm').on('submit', function () {
      var formError = $(this).find('.js-form-error');
      var usernameError = $(this).find('.js-username-error');
      var emailError = $(this).find('.js-email-error');
      var passwordError = $(this).find('.js-password-error');
      var passwordRepeatError = $(this).find('.js-password-repeat-error');
      usernameError.text('');
      emailError.text('');
      passwordError.text('');
      passwordRepeatError.text('');

      var username = $(this).find('.js-username').val();
      var email = $(this).find('.js-email').val();
      var password = $(this).find('.js-password').val();
      var passwordRepeat = $(this).find('.js-password-repeat').val();

      var usernameErrorText = "Ingrese un usuario";
      var emailErrorText = "Ingrese un email";
      var passwordErrorText = "Ingrese un password";
      var passwordRepeatErrorText = "Ingrese nuevamente el password";
      var passwordNotEqualsText = "Los passwords no coinciden";

      if (username === '') {
        usernameError.text(usernameErrorText);
        return false;
      }

      if (email === '') {
        emailError.text(emailErrorText);
        return false;

      }
      if (password === '') {
        passwordError.text(passwordErrorText);
        return false;
      }
      if (passwordRepeat === '') {
        passwordRepeatError.text(passwordRepeatErrorText);
        return false;
      }
      if (password !== passwordRepeat) {
        passwordError.text(passwordNotEqualsText);
        return false;
      }
      var registerData = {
        username: username,
        email: email,
        password: password
      };
      securityService.register(registerData).then(function (response) {
        console.log('response: ', response);
        if (response.status === 200) {
          var user = response.data;
          var loginData = {
            username: username,
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
            sessionService.clearSession();
            if (response.data && response.data.message) {
              formError.text(response.data.message);
            } else {
              formError.text('Ha ocurrido un error. Intente luego.');
            }
            return;
          });
        } else {
          sessionService.clearSession();
          formError.text(response.data.message);
          return;
        }
      }, function (response) {
        formError.text(response.data.exception);
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
              sessionService.setAuthentication(response.data);
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
                sessionService.setAuthentication(response.data);
                $rootScope.user = securityService.getUser();
                $location.path('/');
              });

            });
          });
        }
      }, {scope: 'email'});

    });

  });
