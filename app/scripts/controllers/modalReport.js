'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:ModalReportCtrl
 * @description
 * # ModalReportCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('ModalReportCtrl', function ($scope, $uibModalInstance, reportService) {
    $scope.report = {
      mensaje: '',
      idDocumento: $scope.reportDocumentId
    };
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.send = function () {
      if($scope.report.mensaje === ''){
        return false;
      }
      reportService.save($scope.report).then(function(response){
        $uibModalInstance.close('ok');
      })
      .catch(function(error){
        $uibModalInstance.close('error');
      });
    };
  });
