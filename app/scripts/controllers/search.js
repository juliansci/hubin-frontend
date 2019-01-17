'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('SearchCtrl', function ($rootScope, $scope, $routeParams, $location, $q, $window,
                                      documentService) {
    $scope.searchDocumentName = '';
    $scope.filters = [];
    $scope.documents = [];
    $window.scrollTo(0, 0);
    $scope.returnIdByValueFilter = function(items, section){
      if(section === 'name'){
        return items[0];
      }
      var array = [];
      if(section === 'entity'){
        array = $rootScope.entities;
      }
      if(section === 'subject'){
        array = $rootScope.subjects;
      }
      if(section === 'language'){
        array = $rootScope.languages;
      }
      if(section === 'level'){
        array = $rootScope.levels;
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


    $scope.initFiltersFromParams = function(params) {
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
    };
    $rootScope.$watch('entitiesLoaded',function(newValue,oldValue) {
      if (newValue === true) {
        $scope.entities = $rootScope.entities;
        $scope.levels = $rootScope.levels;
        $scope.languages = $rootScope.languages;
        $scope.subjects = $rootScope.subjects;
        $scope.initFiltersFromParams($routeParams);
        return;
      }
    });

    $scope.addFilter = function (filterObject, section) {
      var filter = {
        value: filterObject.code,
        section: section
      };
      console.log($scope.filters);
      console.log(filter);

      for(var i = 0; i < $scope.filters.length; i++){
        var currentFilter = $scope.filters[i];
        if(currentFilter['value'] == filter['value']){
          return false;
        }
      }
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

    $scope.searchDocumentByName = function (e) {
      if ($scope.searchDocumentName !== '') {
        $location.path("/search").search({name: $scope.searchDocumentName});
      }
      e.preventDefault();
      return false;
    };


    $scope.matchEntitiesDocuments = function(){
      for(var i = 0; i < $scope.documents.length; i++){
        var currentDocument = $scope.documents[i];
        $scope.documents[i]['entidad'] = $rootScope.entities.find(x => x.id == currentDocument['entidad']);
        $scope.documents[i]['materia'] = $rootScope.subjects.find(x => x.id == currentDocument['materia']);
        $scope.documents[i]['idioma'] = $rootScope.languages.find(x => x.id == currentDocument['idioma']);
        $scope.documents[i]['nivel'] = $rootScope.levels.find(x => x.id == currentDocument['nivel']);
      }
    };



  });
