angular.module('hubinFrontendApp').directive('comments', ['$translate', 'toastr', 'documentService',
  function ($translate, toastr, documentService) {
    return {
      scope: {
        entity: '='
      },
      restrict: 'E',
      templateUrl: 'views/directives/comments.html',
      replace: true,
      controller: function ($scope, $element, $attrs, $transclude, $uibModal, toastr,
                            commentService) {
        $scope.currentCommentStr = '';

        $scope.sendComment = function(){
          if($scope.currentCommentStr){
            var comment = {
              mensaje: $scope.currentCommentStr,
              idDocumento: $scope.entity.id
            };
            commentService.create(comment).then(function (result) {
              $scope.currentCommentStr = '';
              $scope.refreshComments();
              toastr.success('Comentario enviado correctamente!');
            }).catch(function (error) {
              console.log(error);
              toastr.error('Ha ocurrido un error. Intente luego.');
            });
          }
        }
        $scope.refreshComments = function(){
          documentService.getComments($scope.entity.id)
            .then(function (response) {
              $scope.entity.comments = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        };
        $scope.refreshComments();
      },
      link: function ($scope, iElm, iAttrs, controller) {

      }
    };
  }]);
