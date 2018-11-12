'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:ModalFeedbackCtrl
 * @description
 * # ModalFeedbackCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('ModalFeedbackCtrl', function ($scope, $uibModalInstance, feedbackService) {
    $scope.feedback = {
      tipo: $scope.feedbackType,
      mensaje: ''
    };
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.send = function () {
      if($scope.feedback.mensaje === ''){
        return false;
      }
      console.log($scope.feedback);
      feedbackService.save($scope.feedback).then(function(response){
        $uibModalInstance.close('ok');
      })
      .catch(function(error){
        $uibModalInstance.close('error');
      });
    };
  });
