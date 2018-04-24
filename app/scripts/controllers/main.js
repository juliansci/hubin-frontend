'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('MainCtrl', function (sessionService, $interval) {
    $interval(headerTextAnimation, 6000);


    function headerTextAnimation() {
      var maxSteps = 3;
      var currentItem = $('.js-text-slider .item.active');
      var currentItemNumber = currentItem.data('step-number');
      $('.js-text-slider .item').removeClass('active');
      (currentItemNumber < maxSteps) ? currentItemNumber++ : (currentItemNumber = 1);
      $('.js-text-slider .item[data-step-number="' + currentItemNumber + '"]').addClass('active');
    }
  });
