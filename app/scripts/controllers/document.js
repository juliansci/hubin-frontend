'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:DocumentCtrl
 * @description
 * # DocumentCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('DocumentCtrl', function ($rootScope, $scope, $routeParams, $location, $q, $translate,
                                        documentService, $uibModal, toastr, scoreService, userService) {

    $scope.documentWithFile = false;

    $scope.isScored = false;
    $scope.documentScore = 0;

    $scope.processScores = function () {
      for (var i = 0; i < $rootScope.scores.length; i++) {
        var currentScore = $rootScope.scores[i];
        if (currentScore['idDocumento'] === $scope.document.id) {
          $scope.isScored = true;
          $scope.documentScore = parseInt(currentScore['puntuacion']);
        }
      }
    };
    $rootScope.$watch('entitiesLoaded', function (newValue) {
      if (newValue === true) {
        documentService.getById($routeParams.id)
          .then(function (response) {
            $scope.document = response.data;
            $scope.currentEntity = $scope.entities.find(function(e){
              if($scope.document['entidad'] == e['id']) return e;
            });
            $scope.currentSubject = $scope.subjects.find(function(e){
              if($scope.document['materia'] == e['id']) return e;
            });
            $scope.currentLanguage = $scope.languages.find(function(e){
              if($scope.document['idioma'] == e['id']) return e;
            });
            $scope.document['fechaCreacion'] = $scope.document['fechaCreacion'].split("-")[0];
            if ($scope.document.versiones.length > 0) {
              $scope.documentWithFile = true;
            }
            $scope.processScores();
            $scope.getRelatedDocuments();

          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });

    $scope.getRelatedDocuments = function(){
      $scope.relatedDocuments = [];
      documentService.getRelatedDocuments($scope.document.id).then(function(response){
        $scope.relatedDocuments = response.data;
        $scope.matchEntitiesDocuments();
      });
    }
    $scope.matchEntitiesDocuments = function(){
      for(var i = 0; i < $scope.relatedDocuments.length; i++){
        var currentDocument = $scope.relatedDocuments[i];
        $scope.relatedDocuments[i]['entidad'] = $rootScope.entities.find(x => x.id == currentDocument['entidad']);
        $scope.relatedDocuments[i]['materia'] = $rootScope.subjects.find(x => x.id == currentDocument['materia']);
        $scope.relatedDocuments[i]['idioma'] = $rootScope.languages.find(x => x.id == currentDocument['idioma']);
        $scope.relatedDocuments[i]['nivel'] = $rootScope.levels.find(x => x.id == currentDocument['nivel']);
        $scope.relatedDocuments[i]['fechaCreacion'] = $scope.relatedDocuments[i]['fechaCreacion'].split("-")[0];

      }
    };

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
    $scope.reportDocument = function () {
      $scope.reportDocumentId = $scope.document.id;
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modalReport.html',
        controller: 'ModalReportCtrl',
        controllerAs: '$modalCtrl',
        scope: $scope
      });
      modalInstance.result.then(function (data) {
        if (data === 'ok') {
          toastr.success('Denuncia enviada');
        } else {
          toastr.error('Ha ocurrido un error. Intente luego.');
        }
      }, function (error) {
      });
    }
  });
