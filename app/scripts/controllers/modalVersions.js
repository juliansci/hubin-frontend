'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:ModalVersionsCtrl
 * @description
 * # ModalFeedbackCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('ModalVersionsCtrl', function ($scope, toastr, $uibModalInstance, documentService) {
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.downloadVersion = function (currentVersion) {
      documentService.download($scope.documentVersions.id, currentVersion.id).then(function (data) {
        var version = data.data;
        var extension = version.extension;
        var base64 = version.data;
        var contentType = $scope.getContentTypeByExtension(extension);
        var blob = $scope.base64ToBlob(base64, contentType);
        var blobUrl = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.download = $scope.documentVersions.nombre + '-' + currentVersion.fecha + '.' + extension;
        $('.js-file').append(a);
        a.click();
      }).catch(function (error) {
        console.log(error);
      });
    };
    $scope.removeVersion = function (currentVersion) {
      documentService.removeVersion($scope.documentVersions.id, currentVersion.id).then(function (data) {
        $('#versionId-'+currentVersion.id).remove();
      }).catch(function (error) {
        console.log(error.data);
        toastr.error(error.data.message);
      });
    };
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

  });
