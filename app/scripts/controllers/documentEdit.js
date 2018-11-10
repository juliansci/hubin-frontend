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
                                            documentService, toastr,$uibModal) {
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
          var document = response.data;
          $scope.documentForm = {
            name: document.nombre,
            description: document.descripcion,
            level: String(document.nivel),
            subject: String(document.materia),
            entity: String(document.entidad),
            language: String(document.idioma)
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
          documentService.update($routeParams.id, documentSave).then(function (documentUpdated) {
            console.log(documentUpdated);
            /*$scope.sendDocumentFile($($('.js-document-file')[0]), documentCreated.data.id)
              .then(function (response) {
                toastr.success('Documento creado correctamente');
                $location.path("/document/" + documentCreated.data.id);
              }).catch(function (error) {
              console.log('error');
              console.log(error);
              toastr.error('Ha ocurrido un error. Intente luego.');
            });*/
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
      var inputFile = $('.js-document-file')[0];
      if (!inputFile.files || !inputFile.files[0]) {
        toastr.error('Ingrese un archivo');
        isValid = false;
      }
      return isValid;
    }
    $scope.showAlert = function () {
      console.log('open popiup');
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modalFeedback.html',
        controller: 'ModalFeedbackCtrl',
        controllerAs: '$modalCtrl'

      });
      /*modalInstance.result.then(function (selectedItem) {
        console.log(selectedItem);
      }, function () {
        console.log('aca');
      });*/
    }

  });
