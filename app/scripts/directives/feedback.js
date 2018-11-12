angular.module('hubinFrontendApp').directive('feedback', ['$translate', 'toastr', 'documentService',
  function ($translate, toastr, documentService) {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/feedback.html',
      replace: true,
      controller: function ($scope, $element, $attrs, $transclude, $uibModal, toastr) {
        $scope.showFeedback = function (type) {
          $scope.feedbackType = type;
          var modalInstance = $uibModal.open({
            templateUrl: 'views/modalFeedback.html',
            controller: 'ModalFeedbackCtrl',
            controllerAs: '$modalCtrl',
            scope: $scope
          });
          modalInstance.result.then(function (data) {
            if(data === 'ok'){
              toastr.success('Feedback enviado');
            }else{
              toastr.error('Ha ocurrido un error. Intente luego.');
            }
          }, function(error){});
        }
      },
      link: function ($scope, iElm, iAttrs, controller) {

      }
    };
  }]);
