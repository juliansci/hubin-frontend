'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('MainCtrl', function ($scope, $location, sessionService, $interval, subjectService) {

    $interval(headerTextAnimation, 6000);
    $scope.searchDocumentName = '';
    $scope.subjectsOutstanding = [];
    subjectService.getAllOutstanding().then(function(response){
      $scope.subjectsOutstanding = response.data;
    });
    $scope.searchDocument = function (e) {
      if ($scope.searchDocumentName !== '') {
        $location.path("/search").search({name: $scope.searchDocumentName});
      }
      e.preventDefault();
      return false;
    };
    function headerTextAnimation() {
      console.log('header text animation');
      var maxSteps = 3;
      var currentItem = $('.js-text-slider .item.active');
      var currentItemNumber = currentItem.data('step-number');
      $('.js-text-slider .item').removeClass('active');
      (currentItemNumber < maxSteps) ? currentItemNumber++ : (currentItemNumber = 1);
      $('.js-text-slider .item[data-step-number="' + currentItemNumber + '"]').addClass('active');
    }
  });
