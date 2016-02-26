/**
 * Created by bosone on 2/3/16.
 */
var expositionApp = angular.module('expositions', ['ngResource', 'permission', 'ui.router', 'exposition.services', 'angularMoment', 'offer.services', 'auth.services'])
    .run(function (RoleStore, AuthServices, $q) {
        RoleStore.defineRole('organizer', [], function () {
            var deferred = $q.defer();
            AuthServices.hasRole('organizer').success(function (data) {
                if (data.hasRole === true) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        });
        RoleStore.defineRole('exponent', [], function () {
            var deferred = $q.defer();
            AuthServices.hasRole('exponent').success(function (data) {
                if (data.hasRole === true) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        });
    });

expositionApp.config(['$stateProvider', '$urlRouterProvider',

    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('exposition', {
                url: "/exposition/",
                templateUrl: 'app/exposition/list.tpl.html',
                controller: 'ExpositionsController'
            })
            .state('expositioncreate', {
                url: "/exposition/create/",
                templateUrl: 'app/exposition/create.tpl.html',
                controller: 'ExpositionsController',
                data: {
                    permissions: {
                        only: ['organizer'],
                        redirectTo: function () {
                            return 'exposition';
                        }
                    }
                }
            })
            .state('expositionview', {
                url: "/exposition/:id/",
                templateUrl: 'app/exposition/details.tpl.html',
                controller: 'ExpositionsController'
            })
            .state('expositionedit', {
                url: "/exposition/:id/edit/",
                templateUrl: 'app/exposition/edit.tpl.html',
                controller: 'ExpositionsController'
            });
    }
]);

expositionApp.controller('ExpositionsController', ['$scope', '$resource', '$state', '$location', 'Upload', 'ExpositionService', '$rootScope',
    function ($scope, $resource, $state, $location, Upload, ExpositionService, $rootScope) {
        var loadExpositions = function () {
            ExpositionService.findAll().then(
                function (data) {
                    $scope.expositions = data.data;
                    if ($state.params.id) {
                        $scope.findExposition($state.params.id);
                    }
                }, function () {
                    alert("Error loading expositions");
                });
        };

        if (!$scope.expositions) {
            loadExpositions();
        }
        $scope.exposition = {};
        $scope.exposition.presentation = {};
        $scope.exposition.photo = {};

        $scope.findExposition = function (_id) {
            ExpositionService.findOne(_id).then(function (data) {
                console.log(data.data);
                $scope.exposition = data.data;
            }, function () {
                alert("Error loading exposition");
            });
        };

        $scope.createExposition = function () {
            if ($scope.expositionCreateForm != 'undefined') {
                if (this.exposition) {
                    ExpositionService.save(this.exposition).then(function (result) {
                        if(result.errors){
                            alert("Error");
                            return;
                        }
                        $scope.expositions.push(result);
                        $location.path("/exposition/");
                    }, function () {
                        alert("Error on creating expostion");
                    });
                }
            }
        };

        $scope.updateExposition = function (_id) {
            if (this.exposition) {
                ExpositionService.edit(_id, this.exposition).then(function () {
                    $location.path("/exposition/" + _id + "/");
                }, function () {
                    alert("Error on editing expostion");
                });
            }
        };

        $scope.deleteExposition = function (_id) {
            ExpositionService.delete(_id).then(function(){
                $location.path("/exposition/");
            }, function(){
                alert("Error on deleting expostion");
            });
        };

        $scope.reset = function () {
            $scope.exposition = {};
            $location.path("/exposition/create/")
        };

        $scope.uploadPhoto = function (image) {
            var reader = new FileReader();
            var type = 'image/png';
            reader.addEventListener("load", function () {
                var readyImg = resizeImg(reader.result);
                document.getElementById("photo-preview").setAttribute('src', readyImg);
                readyImg = readyImg.replace(type, "");
                readyImg = readyImg.replace("data:", "");
                readyImg = readyImg.replace(";base64,", "");
                $scope.exposition.photo.content = readyImg;
                $scope.exposition.photo.type = type;
            }, false);

            if (image) {
                reader.readAsDataURL(image);
            }
        };

        $scope.uploadPresentation = function (file) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var presentationBase64 = reader.result;
                document.getElementById("presentation-name").textContent = "123";
                presentationBase64 = presentationBase64.replace(file.type, "");
                presentationBase64 = presentationBase64.replace("data:", "");
                presentationBase64 = presentationBase64.replace(";base64,", "");
                $scope.exposition.presentation.content = presentationBase64;
                $scope.exposition.presentation.type = file.type;
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        };

        function resizeImg(file) {
            var canvas = document.createElement('canvas');
            var img = new Image();
            img.src = file;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 200;
            var MAX_HEIGHT = 300;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL("image/png");
            return dataurl;
        }

    }
]);
