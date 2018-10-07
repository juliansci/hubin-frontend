'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:EntityCtrl
 * @description
 * # EntityCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('EntityCtrl', function ($rootScope, $scope, $routeParams, $location, $q,
                                      documentService, entityService) {
    $scope.searchDocumentName = '';
    $scope.entity = {};
    $scope.randomImage = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    $scope.documents = [];

    $rootScope.$watch('entitiesLoaded',function(newValue) {
      if (newValue === true) {
        entityService.getById($routeParams.id)
          .then(function(response){
            $scope.entity = response.data;
            documentService.getAllByFilters({'entity': $scope.entity.id}).then(function(response){
              $scope.documents = response.data;
              $scope.matchEntitiesDocuments();
            });
          })
          .catch(function(error){
            console.log(error);
          });
        return;
      }

    });

    $scope.matchEntitiesDocuments = function(){
      for(var i = 0; i < $scope.documents.length; i++){
        var currentDocument = $scope.documents[i];
        $scope.documents[i]['entidad'] = $rootScope.entities.find(x => x.id == currentDocument['entidad']);
        $scope.documents[i]['materia'] = $rootScope.subjects.find(x => x.id == currentDocument['materia']);
        $scope.documents[i]['idioma'] = $rootScope.languages.find(x => x.id == currentDocument['idioma']);
        $scope.documents[i]['nivel'] = $rootScope.levels.find(x => x.id == currentDocument['nivel']);
        $scope.documents[i]['fechaCreacion'] = $scope.documents[i]['fechaCreacion'].split("-")[0];
      }
    };
    $scope.searchDocument = function (e) {
      if ($scope.searchDocumentName !== '') {
        $location.path("/search").search({name: $scope.searchDocumentName, entity: $scope.entity.code});
      }
      e.preventDefault();
      return false;
    };
  });
