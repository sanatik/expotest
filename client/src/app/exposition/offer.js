/**
 * Created by bosone on 2/3/16.
 */
var offerApp = angular.module('offers', ['ngResource', 'ui.router', 'offer.services', 'angularMoment']);

offerApp.config(['$stateProvider', '$urlRouterProvider',

    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('offer', {
                url: "/exposition/:expId/offer/",
                templateUrl: 'app/exposition/listOffers.tpl.html',
                controller: 'OffersController'
            })
            .state('offercreate', {
                url: "/exposition/:expId/offer/create/",
                templateUrl: 'app/exposition/createOffer.tpl.html',
                controller: 'OffersController'
            })
            .state('offerview', {
                url: "/exposition/:expId/offer/:id/",
                templateUrl: 'app/exposition/detailsOffer.tpl.html',
                controller: 'OffersController'
            });
    }
]);


offerApp.controller('OffersController', ['$scope', '$resource', '$state', '$location', 'OfferUpdateService', 'Upload',
    function ($scope, $resource, $state, $location, OfferUpdateService, Upload) {
        var OfferResource = $resource('/offer/:id');
        var ExpositionResource = $resource('/exposition/:id');
        $scope.offerUpdateService = new OfferUpdateService();
        var loadOffers = function () {
            return OfferResource.query(function (results) {
                $scope.offers = results;
                if ($state.params.id) {
                    $scope.findOffer($state.params.id);
                }
            });
        };


        if (!$scope.offers) {
            loadOffers();
        }


        $scope.createOffer = function () {
            if ($scope.offerCreateForm != 'undefined') {
                var createOfferResource = new OfferResource();
                createOfferResource.displayName = $scope.offerName;
                createOfferResource.photo = $scope.uploadPhoto;
                createOfferResource.description = $scope.description;
                createOfferResource.$save(function (result) {
                    $scope.offerName = '';
                    $scope.offers.push(result);
                    $location.path("/offer/")
                });
            }
        };

        $scope.reset = function () {
            $scope.$broadcast('show-errors-reset');
            $scope.offerName = "";
            $scope.offerDate = "";
            $scope.offerFromTime = "";
            $scope.offerToTime = "";
            $scope.offerVenue = "";
            $location.path("/offer/create/")
        };


        $scope.findOffer = function (_id) {
            $scope.offerUpdateService = new OfferUpdateService();
            $scope.offerUpdateService.$get({id: _id}, function (result) {
                $scope.offer = result;
            });
        };

        $scope.updateOffer = function (_id) {
            $scope.offerUpdateService = new OfferUpdateService();
            $scope.offerUpdateService.displayName = $scope.offer.name;
            $scope.offerUpdateService.$update({id: _id}, function (result) {
                $location.path("/offer/")
            });
        };

        $scope.getOffer = function (_id) {
            $scope.offerUpdateService.$get({id: _id}, function (result) {
                $scope.offer = result;
                $location.path("/offer/" + _id + "/")
            });
            $scope.offer
        };

        $scope.deleteOffer = function (_id) {
            $scope.offerUpdateService.$delete({id: _id}, function (result) {
                $scope.reloadPage();

            });
        };

        $scope.reloadPage = function () {
            window.location.reload();
        };

        $scope.upload = function (file) {
            Upload.upload({
                url: '/uploadImage',
                data: {file: file, 'username': $scope.username}
            }).then(function (resp) {
                var fileName = resp.data.split('/')[3];
                $scope.uploadPhoto = fileName;
                $("#photoSpan").text(resp.config.data.file.name);
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };


    }
]);
