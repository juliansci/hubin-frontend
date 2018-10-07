'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:SubjectCtrl
 * @description
 * # SubjectCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('SubjectCtrl', function ($rootScope, $scope, $routeParams, $location, $q,
                                      documentService, subjectService) {
    $scope.searchDocumentName = '';
    $scope.subject = {};
    $scope.documents = [];

    $rootScope.$watch('entitiesLoaded',function(newValue) {
      if (newValue === true) {
        subjectService.getById($routeParams.id)
          .then(function(response){
            $scope.subject = response.data;
            documentService.getAllByFilters({'subject': $scope.subject.id}).then(function(response){
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
        $location.path("/search").search({name: $scope.searchDocumentName, subject: $scope.subject.code});
      }
      e.preventDefault();
      return false;
    };
  });
