'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:DocumentEditCtrl
 * @description
 * # DocumentEditCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('DocumentEditCtrl', function ($rootScope, $scope, $routeParams, $location, $q, $translate,
                                            documentService, toastr, $uibModal) {
    $scope.documentForm = {
      level: "1",
      language: "1",
      entity: "1",
      subject: "1"
    };
    $scope.documentFormError = {};
    $scope.onEdit = false;
    if ($routeParams.id !== undefined) {
      $scope.onEdit = true;
      documentService.getById($routeParams.id)
        .then(function (response) {
          $scope.document = response.data;
          if ($scope.document.creador.id !== $scope.user.id) {
            $location.path('/');
          }
          console.log('document: ', $scope.document);
          $scope.documentForm = {
            name: $scope.document.nombre,
            description: $scope.document.descripcion,
            level: String($scope.document.nivel),
            subject: String($scope.document.materia),
            entity: String($scope.document.entidad),
            language: String($scope.document.idioma)
          };
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    $scope.sendDocument = function () {
      if ($scope.isValid($scope.documentForm)) {
        var documentSave = {
          "nombre": $scope.documentForm.name,
          "descripcion": $scope.documentForm.description,
          "idNivel": $scope.documentForm.level,
          "idMateria": $scope.documentForm.subject,
          "idEntidad": $scope.documentForm.entity,
          "idIdioma": $scope.documentForm.language
        };

        if ($scope.onEdit) {
          console.log('onEdit');
          console.log('$routeParams.id: ', $routeParams.id);
          documentService.update($routeParams.id, documentSave).then(function (documentUpdated) {
            var inputFile = $('.js-document-file')[0];
            if (inputFile.files && inputFile.files[0]) {
              $scope.sendDocumentFile($(inputFile), documentUpdated.data.id)
                .then(function (response) {
                  toastr.success('Documento actualizado correctamente');
                  $location.path("/document/" + documentUpdated.data.id);
                }).catch(function (error) {
                console.log('error');
                console.log(error);
                toastr.error('Ha ocurrido un error. Intente luego.');
              });
            }else{
              toastr.success('Documento actualizado correctamente');
              $location.path("/document/" + documentUpdated.data.id);
            }
          }).catch(function (error) {
            console.log('error');
            console.log(error);
            toastr.error('Ha ocurrido un error. Intente luego.');
          });

        } else {
          documentService.save(documentSave).then(function (documentCreated) {
            $scope.sendDocumentFile($($('.js-document-file')[0]), documentCreated.data.id)
              .then(function (response) {
                toastr.success('Documento creado correctamente');
                $location.path("/document/" + documentCreated.data.id);
              }).catch(function (error) {
              console.log('error');
              console.log(error);
              toastr.error('Ha ocurrido un error. Intente luego.');
            });
          }).catch(function (error) {
            console.log('error');
            console.log(error);
            toastr.error('Ha ocurrido un error. Intente luego.');
          });
        }
      }
    };

    $scope.sendDocumentFile = function ($input, documentId) {
      var form = $input.parents('form');
      var formData = new FormData(form[0]);
      return documentService.addFileToDocument(formData, documentId);
    }

    $scope.isValid = function (documentForm) {
      $scope.documentFormError = {};
      var isValid = true;
      if (documentForm.name === undefined || documentForm.name === '') {
        $scope.documentFormError.name = true;
        $translate('document.form_invalid_name').then(function (text) {
          toastr.error(text);
        });
        isValid = false;
      }
      if (documentForm.description === undefined || documentForm.description === '') {
        $scope.documentFormError.description = true;
        toastr.error('Ingrese una descripcion del documento valida');
        isValid = false;
      }
      if (!$scope.onEdit) {
        var inputFile = $('.js-document-file')[0];
        if (!inputFile.files || !inputFile.files[0]) {
          toastr.error('Ingrese un archivo');
          isValid = false;
        }
      }

      return isValid;
    }
    $scope.showFeedback = function (type) {
      $scope.feedbackType = type;
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modalFeedback.html',
        controller: 'ModalFeedbackCtrl',
        controllerAs: '$modalCtrl',
        scope: $scope
      });
      modalInstance.result.then(function (data) {
        if (data === 'ok') {
          toastr.success('Feedback enviado');
        } else {
          toastr.error('Ha ocurrido un error. Intente luego.');
        }
      }, function (error) {
      });
    }

  });
