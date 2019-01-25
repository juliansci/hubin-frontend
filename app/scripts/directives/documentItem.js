angular.module('hubinFrontendApp').directive('documentItem', ['$translate', 'toastr', 'documentService',
  function ($translate, toastr, documentService) {
    return {
      scope: {
        document: '='
      },
      restrict: 'E',
      templateUrl: 'views/directives/documentItem.html',
      replace: true,
      controller: function ($rootScope, $scope, $element, $attrs, $transclude, $uibModal, toastr,
                            scoreService, userService, documentService) {
        $scope.documentWithFile = false;
        if ($scope.document.versiones.length > 0) {
          $scope.documentWithFile = true;
        }
        $scope.isScored = false;
        $scope.documentScore = 0;
        $scope.processScores = function(){
          for(var i = 0; i < $rootScope.scores.length; i++){
            var currentScore = $rootScope.scores[i];
            if(currentScore['idDocumento'] === $scope.document.id){
              $scope.isScored = true;
              $scope.documentScore = parseInt(currentScore['puntuacion']);
            }
          }
        };
        $scope.loadComments = function(){
          documentService.getComments($scope.document.id)
            .then(function (response) {
              $scope.document.comments = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        };
        $scope.processScores();
        $scope.loadComments();
        $scope.downloadDocument = function () {
          var versiones = $scope.document.versiones;
          if (versiones.length > 0) {
            var currentVersion = versiones[versiones.length - 1];
            documentService.download($scope.document.id, currentVersion).then(function (data) {
              var version = data.data;
              var extension = version.extension;
              var base64 = version.data;
              var contentType = $scope.getContentTypeByExtension(extension);
              var blob = $scope.base64ToBlob(base64, contentType);
              var blobUrl = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.href = blobUrl;
              a.target = '_blank';
              a.download = $scope.document.nombre + '.' + extension;
              $('.js-file').append(a);
              a.click();
            }).catch(function (error) {
              console.log(error);
            });
          }

        }
        $scope.base64ToBlob = function (b64Data, contentType, sliceSize) {
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = atob(b64Data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, {type: contentType});
          return blob;
        }
        $scope.getContentTypeByExtension = function (extension) {
          var contentType = 'text/plain';
          if (extension === 'jpg' || extension === 'JPG' ||
            extension === 'jpeg' || extension === 'JPEG') {
            return 'image/jpeg';
          }
          if (extension === 'png' || extension === 'PNG') {
            return 'image/png';
          }
          if (extension === 'pdf' || extension === 'PDF') {
            return 'application/pdf';
          }
          return contentType;
        };
        $scope.sendScore = function (score) {
          var scoreToSend = {
            puntuacion: score,
            idDocumento: $scope.document.id
          };
          scoreService.save(scoreToSend).then(function (result) {
            userService.getScores().then(function (result) {
              $rootScope.scores = result.data;
              toastr.success('El documento ha sido puntuado exitosamente!');
            }).catch(function (error) {
              console.log(error);
              toastr.error('Ha ocurrido un error. Intente luego.');
            })
          }).catch(function (error) {
            console.log(error);
            toastr.error('Ha ocurrido un error. Intente luego.');
          });

        };
        $scope.reportDocument = function(){
          $scope.reportDocumentId = $scope.document.id;
          var modalInstance = $uibModal.open({
            templateUrl: 'views/modalReport.html',
            controller: 'ModalReportCtrl',
            controllerAs: '$modalCtrl',
            scope: $scope
          });
          modalInstance.result.then(function (data) {
            if(data === 'ok'){
              toastr.success('Denuncia enviada');
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
