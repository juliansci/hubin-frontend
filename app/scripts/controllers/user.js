'use strict';

/**
 * @ngdoc function
 * @name hubinFrontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the hubinFrontendApp
 */
angular.module('hubinFrontendApp')
  .controller('UserCtrl', function ($rootScope, $scope, $location, $http, $route,
                                    userService, securityService, toastr,
                                    $routeParams, documentService) {
    var userId = securityService.getUser().id;
    if ($routeParams.id) {
      userId = $routeParams.id;
    }
    $scope.onEditProfile = false;
    $scope.isProfileUserLogged = false;
    userService.getUser(userId).then(function (response) {
      $scope.userProfile = response.data;
      if ($scope.userProfile.id === securityService.getUser().id) {
        $scope.isProfileUserLogged = true;
        initEdition();
      }
    }).catch(function (data) {
    });
    $scope.uploadedDocuments = [];
    $scope.sharedDocuments = [];
    $scope.removedDocuments = [];
    userService.getDocuments()
      .then(function (response) {
        $scope.uploadedDocuments = response.data.documentosCreados;
        $scope.matchEntitiesDocuments($scope.uploadedDocuments);
        $scope.sharedDocuments = response.data.documentosConAcceso;
        $scope.matchEntitiesDocuments($scope.sharedDocuments);
        $scope.removedDocuments = response.data.documentosEliminados;
        $scope.matchEntitiesDocuments($scope.removedDocuments);
      })
      .catch(function (error) {
        console.log(error);
      });


      function initEdition() {
        $('body').on('click','.js-edit-profile', function () {
          $scope.$apply(function () {
            $scope.onEditProfile = !$scope.onEditProfile;
          });
          if ($scope.onEditProfile) {
            $('.js-user-username').editable({
              type: 'text',
              title: 'Ingrese su usuario'
            });
            $('.js-user-name').editable({
              type: 'text',
              title: 'Ingrese su nombre'
            });
            $('.js-user-email').editable({
              type: 'text',
              title: 'Ingrese su email'
            });
            $('.js-user-description').editable({
              type: 'text',
              title: 'Ingrese una descripcion'
            });
          } else {
            $('.js-user-name, .js-user-email, .js-user-description, .js-user-username').editable('destroy');
            var username = $('.js-user-username').text().trim();
            var name = $('.js-user-name').text().trim();
            var email = $('.js-user-email').text().trim();
            var description = $('.js-user-description').text().trim();
            var usernameChanged = username !== $scope.userProfile.username;
            username = (username === 'Ingrese su usuario') ? '' : username;
            name = (name === 'Ingrese su nombre') ? '' : name;
            description = (description === 'Ingrese una descripcion') ? '' : description;
            email = (email === 'Ingrese su email') ? '' : email;
            var profileUpdate = {
              username: username,
              nombre: name,
              email: email,
              presentacion: description
            };
            userService.updateUser(securityService.getUser().id, profileUpdate).then(function (response) {
              $('.js-user-username, .js-user-name, .js-user-email, .js-user-description').removeClass('editable-unsaved');
              if (usernameChanged) {
                toastr.success('Usuario modificado. Ingrese con el nuevo usuario.');
                $rootScope.logout();
                $location.path('/login');
              }
              $scope.userProfile = response.data;
            }).catch(function (data) {
              console.log(data);
            });
          }

        });
        $('body').on('mouseenter', '.js-image-user', function () {
          $('.js-edit-image').addClass('visible');
        });
        $('body').on('mouseleave', '.js-image-user', function () {
          $('.js-edit-image').removeClass('visible');
        });
        $('body').on('click', '.js-edit-image', function () {
          $('.js-add-image').click();
        })
        $('body').on('change', '.js-add-image', function () {
          var input = this;
          var $input = $(this);
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
              var imagen = e.target.result;
              $input.parents('.js-img-profile').attr('src', imagen);
              sendImageAjax($input, true, imagen);
            };
            reader.readAsDataURL(input.files[0]);
          }
        });
      }

    function sendImageAjax($input, imagen) {
      var form = $input.parents('form');
      var formData = new FormData(form[0]);
      var action = $rootScope.urlServerBase + form.attr('action');
      userService.addImageProfile(action, formData).then(function successCallback(response) {
        if (response.status !== 200) {
          toastr.error('Ha ocurrido un error. Intente luego.');
        } else {
          if (response.data.foto && response.data.foto.base64Src) {
            $('.js-img-profile').attr('src', response.data.foto.base64Src);
            toastr.success("Imagen actualizada correctamente!");
          }
        }
      }, function errorCallback(error) {
        toastr.error('Ha ocurrido un error. Intente luego.');
      });
    }

    $scope.matchEntitiesDocuments = function (documents) {
      for (var i = 0; i < documents.length; i++) {
        var currentDocument = documents[i];
        documents[i]['entidad'] = $rootScope.entities.find(function (x) {
         return x.id == currentDocument['entidad'];
      });

        documents[i]['materia'] = $rootScope.subjects.find(function (x) {
          return x.id == currentDocument['materia']
        });
        documents[i]['idioma'] = $rootScope.languages.find(function (x) {
          return x.id == currentDocument['idioma']
        });
        documents[i]['nivel'] = $rootScope.levels.find(function (x) {
          return x.id == currentDocument['nivel']
        });
        documents[i]['fechaCreacion'] = documents[i]['fechaCreacion'].split("-")[0];

      }
    };

      $scope.removeDocument = function(document){
        documentService.remove(document).then(function successCallback(response) {
          toastr.success('El documento ha sido eliminado.');
          $('#documentId'+document.id).remove();
        }, function errorCallback(error) {
          toastr.error('Ha ocurrido un error. Intente luego.');
        });
      }
    $scope.restoreDocument = function(document){
      documentService.restore(document).then(function successCallback(response) {
        toastr.success('El documento ha sido recuperado.');
        $route.reload();
        }, function errorCallback(error) {
        toastr.error('Ha ocurrido un error. Intente luego.');
      });
    }
  });
