/**
 * Created by bosone on 2/3/16.
 */
var offerApp = angular.module('offers', ['ngResource', 'ui.router', 'offer.services', 'angularMoment', 'auth.services']);

offerApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
                .state('offer', {
                    url: "/offer/",
                    templateUrl: 'app/offer/list.tpl.html',
                    controller: 'OfferController'
                })
                .state('offercreate', {
                    url: "/offer/create/",
                    templateUrl: 'app/offer/create.tpl.html',
                    controller: 'OfferController',
                    data: {
                        permissions: {
                            only: ['exponent'],
                            redirectTo: function () {
                                return 'exposition';
                            }
                        }
                    }
                })
                .state('offerview', {
                    url: "/offer/:id/",
                    templateUrl: 'app/offer/details.tpl.html',
                    controller: 'OfferController'
                })
                .state('offeredit', {
                    url: "/offer/:id/edit/",
                    templateUrl: 'app/offer/create.tpl.html',
                    controller: 'OfferController',
                    data: {
                        permissions: {
                            only: ['exponent'],
                            redirectTo: function () {
                                return 'exposition';
                            }
                        }
                    }
                });
    }
]);


offerApp.controller('OfferController', ['$scope', '$resource', '$state', '$location', 'OfferService', 'Upload',
    function ($scope, $resource, $state, $location, OfferService, Upload) {
        $('.shadow_overlay').fadeOut(100);
        var loadOffers = function () {
            OfferService.findAll().then(function (data) {
                    $scope.offers = data.data;
                if ($state.params.id) {
                    $scope.findOffer($state.params.id);
                }
                $('.grid').masonry({
                    itemSelector: '.grid_item',
                    columnWidth: 250,
                    gutter: 30
                });
            }, function () {
                alert("Error on loading offers");
            });
        };

        if (!$scope.offers) {
            loadOffers();
        }

        $scope.offer = {};
        $scope.offer.photo = {};

        $scope.findOffer = function (_id) {
            OfferService.findOne(_id).then(function (data) {
                $scope.offer = data.data;
            }, function () {
                alert("Error loading offer");
            });
        };

        if ($state.current.name === 'offercreate') {
            $scope.createOfferAction = true;
        }

        $scope.createOffer = function () {
            if ($scope.offerCreateForm != 'undefined') {
                if (this.offer) {
                    OfferService.save(this.offer).then(function (result) {
                        if (result.errors) {
                            alert("Error");
                            return;
                        }
                        $scope.offers.push(result);
                        $location.path("/offer/");
                    }, function () {
                        alert("Error on creating offer");
                    });
                }
            }
        };

        $scope.updateOffer = function (_id) {
            if (this.offer) {
                OfferService.edit(_id, this.offer).then(function () {
                    $location.path("/offer/" + _id + "/");
                }, function () {
                    alert("Error on editing offer");
                });
            }
        };

        $scope.deleteOffer = function (_id) {
            OfferService.delete(_id).then(function () {
                $location.path("/offer/");
            }, function () {
                alert("Error on deleting offer");
            });
        };

        $scope.reset = function () {
            $scope.offer = {};
            $location.path("/offer/create/")
        };

        $scope.upload = function (file) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var readyImg = resizeImg(reader.result);
                document.getElementById("photo-preview").setAttribute('src', readyImg);
                Upload.upload({
                    url: '/uploadImage',
                    data: {file: dataURLtoBlob(readyImg), 'username': $scope.username}
                }).then(function (resp) {
                    var fileName = resp.data.split('/')[3];
                    if (!$scope.offer.photo) {
                        $scope.offer.photo = {};
                    }
                    $scope.offer.photo.filename = fileName;
                    $("#photoSpan").text(resp.config.data.file.name);
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
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

            var MAX_WIDTH = 600;
            var MAX_HEIGHT = 600;
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
        
        $scope.locationPath = function (url) {
            $location.path(url);
        };

    }
]);
