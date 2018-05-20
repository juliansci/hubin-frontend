'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('SearchCtrl', function ($rootScope, $scope, $routeParams) {
    console.log($routeParams);
    $scope.filters = [];
    $scope.filtersColumn = {
      subject: [
        {title: 'Matematica', code: 'matematica'},
        {title: 'Fisica', code: 'fisica'},
        {title: 'Quimica', code: 'quimica'}
      ],
      level: [
        {title: 'principiante', code: 'principiante'},
        {title: 'medio', code: 'medio'},
        {title: 'avanzado', code: 'avanzado'}
      ],
      language: [
        {title: 'espanol', code: 'espanol'},
        {title: 'ingles', code: 'ingles'},
        {title: 'portugues', code: 'portugues'}
      ]
    };
    $scope.addFilter = function (filter) {
      console.log('add filter');
      console.log(filter);
    };
  });
