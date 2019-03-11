angular.module('hubinFrontendApp').directive('comments', ['$translate', 'toastr', 'documentService',
  function ($translate, toastr, documentService) {
    return {
      scope: {
        entity: '=',
        type: '=',
        user: '='

      },
      restrict: 'E',
      templateUrl: 'views/directives/comments.html',
      replace: true,
      controller: function ($rootScope, $scope, $element, $attrs, $transclude, $uibModal, toastr,
                            commentService, subjectService, entityService, userService) {
        $scope.currentCommentStr = '';
        userService.getUser($scope.user.id).then(function (result) {
          $scope.user = result.data;
        }).catch(function (error) {
          console.log(error);
        });
        $scope.sendComment = function () {
          if ($scope.currentCommentStr) {
            if($scope.type === 'document'){
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
            if($scope.type === 'subject'){
              var comment = {
                mensaje: $scope.currentCommentStr,
                idMateria: $scope.entity.id
              };
              commentService.createSubject(comment).then(function (result) {
                $scope.currentCommentStr = '';
                $scope.refreshComments();
                toastr.success('Comentario enviado correctamente!');
              }).catch(function (error) {
                console.log(error);
                toastr.error('Ha ocurrido un error. Intente luego.');
              });
            }
            if($scope.type === 'entity'){
              var comment = {
                mensaje: $scope.currentCommentStr,
                idEntidad: $scope.entity.id
              };
              commentService.createEntity(comment).then(function (result) {
                $scope.currentCommentStr = '';
                $scope.refreshComments();
                toastr.success('Comentario enviado correctamente!');
              }).catch(function (error) {
                console.log(error);
                toastr.error('Ha ocurrido un error. Intente luego.');
              });
            }
          }
        }
        $scope.refreshComments = function () {
          if($scope.type === 'document'){
            documentService.getComments($scope.entity.id)
              .then(function (response) {
                $scope.entity.comentarios = response.data;
              })
              .catch(function (error) {
                console.log(error);
              });
          }
          if($scope.type === 'subject'){
            subjectService.getById($scope.entity.id)
              .then(function (response) {
                console.log('response.data: ', response.data);
                $scope.entity.comentarios = response.data.comentarios;
                console.log('entidyyy after: ', $scope.entity);
              })
              .catch(function (error) {
                console.log(error);
              });
          }
          if($scope.type === 'entity'){
            entityService.getById($scope.entity.id)
              .then(function (response) {
                $scope.entity.comentarios = response.data.comentarios;
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        };
        $scope.$watch('entity', function (newValue, oldValue) {
          if (newValue !== undefined && newValue.id !== oldValue.id) {

            console.log('entidyyy', $scope.entity);

            $scope.refreshComments();
          }
        });


      },
      link: function ($scope, iElm, iAttrs, controller) {

      }
    };
  }]);
