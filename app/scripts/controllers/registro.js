'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:RegistroCtrl
 * @description
 * # RegistroCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
        .controller('RegistroCtrl', function ($rootScope, $scope, $location, securityService, sessionService) {
            $('#registroForm').on('submit', function () {
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
                    sessionService.setItem('user', response.data);
                    sessionService.setSession(registerData);
                    $rootScope.user = securityService.getUser();
                    $location.path('/');
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
                                sessionService.setItem('user', user);
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
                                    sessionService.setItem('user', response.data);
                                    sessionService.setSession(registerData);
                                    $rootScope.user = securityService.getUser();
                                    $location.path('/');
                                });

                            });
                        });
                    }
                }, {scope: 'email'});

            });
        });