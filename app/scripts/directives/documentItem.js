angular.module('hubinFrontendApp').directive('documentItem', ['$translate', 'toastr', 'documentService',
  function ($translate, toastr, documentService) {
    return {
      scope: {
        document: '='
      },
      restrict: 'E',
      templateUrl: 'views/directives/documentItem.html',
      replace: true,
      controller: function ($scope, $element, $attrs, $transclude) {
        $scope.documentWithFile = false;
        console.log($scope.document);
        if ($scope.document.versiones.length > 0) {
          $scope.documentWithFile = true;
        }
        $scope.downloadDocument = function () {
          var versiones = $scope.document.versiones;
          if (versiones.length > 0) {
            var currentVersion = versiones[versiones.length - 1];
            documentService.download($scope.document.id, currentVersion).then(function (data) {
              console.log('ok');
              console.log(data);
              var contentType = 'image/jpeg';
              var blob = $scope.base64ToBlob(data.data.data, contentType);
              var blobUrl = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.href = blobUrl;
              a.target = '_blank';
              a.download = 'file.jpeg';
              console.log(a);
              $('.description').append(a);
              a.click();
            }).catch(function (error) {
              console.log('error');
              console.log(error);
            });
          }

        }
        $scope.base64ToBlob  = function(b64Data, contentType, sliceSize) {
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
      },
      link: function ($scope, iElm, iAttrs, controller) {

      }
    };
  }]);
