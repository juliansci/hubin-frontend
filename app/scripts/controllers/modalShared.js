'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:ModalSharedCtrl
 * @description
 * # ModalFeedbackCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('ModalSharedCtrl', function ($scope, toastr, $uibModalInstance, documentService) {
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
    console.log('init modal shared');
    console.log('$scope.documentShared: ', $scope.documentShared);
    documentService.getUsersToShare($scope.documentShared).then(function successCallback(response) {
      $scope.users = response.data;
      $scope.users = $.map( $scope.users, function( item ) {
        return {
          label: item.username,
          value: item.username,
          id: item.id
        }
      });
      $(".js-user-shared").autocomplete({
        source: $scope.users,
        open: function () {
          $(this).autocomplete('widget').css('z-index', 100);
          return false;
        },
        focus: function (event, ui) {
          $(".js-user-shared").val(ui.item.label);
          return false;
        },
        select: function (event, ui) {
          documentService.addUserShare($scope.documentShared.id, ui.item.id).then(function successCallback(responseAddShared) {
            $(".js-user-shared").val('');
            $scope.documentShared = responseAddShared.data;
            $scope.refreshUsersToShared();
          }, function errorCallback(error) {
            console.log(error);
            toastr.error('Ha ocurrido un error. Intente luego.');
          });
          return false;
        }
      });
    }, function errorCallback(error) {
      console.log(error);
      toastr.error('Ha ocurrido un error. Intente luego.');
    });

    $scope.removeShared = function(idDocument, idUser){
      documentService.removeUserShare(idDocument, idUser).then(function successCallback(responseRemoveShared) {
        $scope.documentShared = responseRemoveShared.data;
        $scope.refreshUsersToShared();
      }, function errorCallback(error) {
        console.log(error);
        toastr.error('Ha ocurrido un error. Intente luego.');
      });
    }

    $scope.refreshUsersToShared = function(){
      documentService.getUsersToShare($scope.documentShared).then(function successCallback(response) {
        $scope.users = response.data;
        $scope.users = $.map( $scope.users, function( item ) {
          return {
            label: item.username,
            value: item.username,
            id: item.id
          }
        });
        $(".js-user-shared").autocomplete("option", { source: $scope.users });

      }, function errorCallback(error) {
        console.log(error);
        toastr.error('Ha ocurrido un error. Intente luego.');
      });
    }
  });
