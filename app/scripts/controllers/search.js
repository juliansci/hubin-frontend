'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('SearchCtrl', function ($rootScope, $scope, $routeParams, $location, $q,
                                      documentService, entityService, subjectService,
                                      levelService, languageService) {
    $scope.searchDocumentName = '';
    $scope.filters = [];
    $scope.entities = [];
    $scope.subjects = [];
    $scope.levels = [];
    $scope.languages = [];
    $scope.documents = [];
    var promises = [];
    var promiseEntities = entityService.getAll().then(function(response){
      return response.data;
    });
    promises.push(promiseEntities);
    var promiseSubjects = subjectService.getAll().then(function(response){
      return response.data;
    });
    promises.push(promiseSubjects);

    var promiseLevels = levelService.getAll().then(function(response){
      return response.data;
    });
    promises.push(promiseLevels);

    var promiseLanguages = languageService.getAll().then(function(response){
      return response.data;
    });
    promises.push(promiseLanguages);

    $scope.initFiltersFromParams = function(params) {

      $q.all(promises).then(function (res) {
        $scope.entities = res[0];
        $scope.subjects = res[1];
        $scope.levels = res[2];
        $scope.languages = res[3];
        var paramsWithIds = {};
        for (var currentKey in params) {
          var currentValue = params[currentKey].split(',');
          for (var currentValueKey in currentValue) {
            var value = currentValue[currentValueKey];
            var filter = {
              value: value,
              section: currentKey
            };
            $scope.filters.push(filter);
          }
          paramsWithIds[currentKey] = $scope.returnIdByValueFilter(currentValue, currentKey);

        }
        documentService.getAllByFilters(paramsWithIds).then(function(response){
          $scope.documents = response.data;
          $scope.matchEntitiesDocuments();
        });

      });
    };

    $scope.initFiltersFromParams($routeParams);

    $scope.addFilter = function (filterObject, section) {
      var filter = {
        value: filterObject.code,
        section: section
      };
      $scope.filters.push(filter);
      $scope.refreshSearch();
    };

    $scope.removeFilter = function (filter){
      $scope.filters.splice($scope.filters.indexOf(filter), 1);
      $scope.refreshSearch();
    };

    $scope.refreshSearch = function(){
      var filtersHub = {
        entity: [],
        subject: [],
        level: [],
        language: [],
        name: []
      };
      for(var key in $scope.filters){
        var filter = $scope.filters[key];
        filtersHub[filter.section].push(filter.value);
      }
      var query = {};
      if(filtersHub.name.length > 0){
        query.name = filtersHub.name.join(',');
      }
      if(filtersHub.entity.length > 0){
        query.entity = filtersHub.entity.join(',');
      }
      if(filtersHub.subject.length > 0){
        query.subject = filtersHub.subject.join(',');
      }
      if(filtersHub.language.length > 0){
        query.language = filtersHub.language.join(',');
      }
      if(filtersHub.level.length > 0){
        query.level = filtersHub.level.join(',');
      }
      $location.path("/search").search(query);
    };

    $scope.searchDocumentByName = function () {
      if ($scope.searchDocumentName !== '') {
        $location.path("/search").search({name: $scope.searchDocumentName});
      }
    };

    $scope.returnIdByValueFilter = function(items, section){
      if(section === 'name'){
        return items[0];
      }
      var array = [];
      if(section === 'entity'){
        array = $scope.entities;
      }
      if(section === 'subject'){
        array = $scope.subjects;
      }
      if(section === 'language'){
        array = $scope.languages;
      }
      if(section === 'level'){
        array = $scope.levels;
      }
      var itemsId = items.map(function(element){
        for(var key in array) {
          var itemWithId = array[key];
          if(itemWithId.code === element){
            return itemWithId.id;
          }
        }

      });
      return itemsId.join(',');
    };

    $scope.matchEntitiesDocuments = function(){
      for(var i = 0; i < $scope.documents.length; i++){
        var currentDocument = $scope.documents[i];
        $scope.documents[i]['entidad'] = $scope.entities.find(x => x.id == currentDocument['entidad']);
        $scope.documents[i]['materia'] = $scope.subjects.find(x => x.id == currentDocument['materia']);
        $scope.documents[i]['idioma'] = $scope.languages.find(x => x.id == currentDocument['idioma']);
        $scope.documents[i]['nivel'] = $scope.levels.find(x => x.id == currentDocument['nivel']);
      }
    };



  });
