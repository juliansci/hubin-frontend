'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:ModalFeedbackCtrl
 * @description
 * # ModalFeedbackCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('ModalFeedbackCtrl', function ($rootScope, $scope, $routeParams, $location, $q) {
    console.log('modal feedback');
    $scope.ok = function(){
      console.log('hola');
    };
    $scope.close = function(){
      console.log('close');
    };
  });
