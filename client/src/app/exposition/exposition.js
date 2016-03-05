/**
 * Created by bosone on 2/3/16.
 */
var expositionApp = angular.module('expositions', ['ngResource', 'permission', 'ui.router', 'exposition.services', 'angularMoment', 'offer.services', 'auth.services']);

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
                })
                .state('expositiooffersview', {
                    url: "/exposition/:id/offers/",
                    templateUrl: 'app/exposition/offerList.tpl.html',
                    controller: 'ExpositionsController'
                })
                .state('expositiooffersviewoffer', {
                    url: "/exposition/:id/offers/:oId/",
                    templateUrl: 'app/exposition/offerDetails.tpl.html',
                    controller: 'ExpositionsController'
                });
    }
]);

expositionApp.controller('ExpositionsController', ['$scope', '$state', '$location', 'ExpositionService',
    function ($scope, $state, $location, ExpositionService) {
        var loadExpositions = function () {
            $("#loader").show();
            ExpositionService.findAll().then(
                    function (data) {
                        $scope.expositions = data.data;
                        $("#loader").hide();
                    },
                    function () {
                        $("#loader").hide();
                        $("#message").html("Error loading expositions").show();
                    });
        };

        $scope.findExposition = function (_id) {
            ExpositionService.findOne(_id).then(function (data) {
                $scope.exposition = data;
            }, function () {
                $("#message").html("Error loading expositions").show();
            });
        };

        if (!$scope.expositions && $state.current.name === 'exposition') {
            loadExpositions();
        }
        $scope.offer = {};
        if (!$scope.exposition &&
                ($state.current.name === 'expositionview'
                        || $state.current.name === 'expositionedit'
                        || $state.current.name === 'expositiooffersview'
                        || $state.current.name === 'expositiooffersviewoffer')) {
            if ($state.params.id) {
                $scope.findExposition($state.params.id);
                if ($state.params.oId) {
                    var offers = $scope.exposition.offers;
                    var o = {};
                    for (var i = 0; i < offers.length; i++) {
                        var offer = offers[i];
                        if (offer._id === $state.params.oId) {
                            o = offer;
                            break;
                        }
                    }
                    $scope.offer = o;
                }
            }
        }
        if (!$scope.exposition && $scope.exposition === 'expositioncreate') {
            $scope.exposition = {};
            $scope.exposition.presentation = {};
            $scope.exposition.photo = {};
        }

        $scope.createExposition = function () {

            if ($scope.expositionCreateForm !== 'undefined') {
                if (this.exposition) {
                    $("#loader").show();
                    ExpositionService.save(this.exposition).then(function (result) {
                        if (result.errors) {
                            $("#loader").hide();
                            $("#message").html(result.errors).show();
                            return;
                        }
                        $scope.expositions.push(result);
                        $location.path("/exposition/");
                    }, function () {
                        $("#loader").hide();
                        $("#message").html("Error on creating expostion").show();
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
            ExpositionService.delete(_id).then(function () {
                $location.path("/exposition/");
            }, function () {
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
