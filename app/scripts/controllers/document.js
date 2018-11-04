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
                                        documentService, toastr) {
    $scope.documentForm = {
      level: "1",
      language: "1",
      entity: "1",
      subject: "1"
    };
    $scope.documentFormError = {};
    console.log($scope.documentForm);
    $scope.sendDocument = function () {
      if ($scope.isValid($scope.documentForm)) {
        console.log('send document');
        console.log($scope.documentForm);
        var inputFile = $('.js-document-file')[0];
        if (inputFile.files && inputFile.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var imagen = e.target.result;
            console.log(e.target);
            console.log(imagen);
          };
          reader.readAsDataURL(inputFile.files[0]);
        }
      }
    };

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

  });
