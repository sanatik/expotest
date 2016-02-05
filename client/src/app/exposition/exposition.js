/**
 * Created by bosone on 2/3/16.
 */
var expositionApp = angular.module('expositions', ['ngResource', 'ui.router', 'exposition.services', 'angularMoment', 'offer.services']);

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
                controller: 'ExpositionsController'
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
            }).state('offer', {
                url: "/exposition/:id/offer/",
                templateUrl: 'app/exposition/listOffers.tpl.html',
                controller: 'ExpositionsController'
            })
            .state('offercreate', {
                url: "/exposition/:id/offer/create/",
                templateUrl: 'app/exposition/createOffer.tpl.html',
                controller: 'ExpositionsController'
            })
            .state('offerview', {
                url: "/offer/:id/",
                templateUrl: 'app/exposition/detailsOffer.tpl.html',
                controller: 'ExpositionsController'
            });
    }
]);

expositionApp.controller('ExpositionsController', ['$scope', '$resource', '$state', '$location', 'ExpositionUpdateService', 'Upload', 'OfferUpdateService',
    function ($scope, $resource, $state, $location, ExpositionUpdateService, Upload, OfferUpdateService) {
        var ExpositionResource = $resource('/exposition/:id'); //this will be the base URL for our rest express route.
        $scope.expositionUpdateService = new ExpositionUpdateService();
        $scope.offerUpdateService = new OfferUpdateService();
        var loadExpositions = function () {
            return ExpositionResource.query(function (results) {
                $scope.expositions = results;
                if ($state.params.id) {
                    $scope.findExposition($state.params.id);
                }
            });
        };


        if (!$scope.expositions) {
            loadExpositions();
        }

        $scope.createExposition = function () {
            if ($scope.expositionCreateForm != 'undefined') {
                var createExpositionResource = new ExpositionResource();
                createExpositionResource.displayName = $scope.expositionName;
                createExpositionResource.price = $scope.expositionPrice;
                createExpositionResource.photo = $scope.uploadPhoto;
                createExpositionResource.startDate = new Date($scope.startDate);
                createExpositionResource.endDate = new Date($scope.endDate);
                createExpositionResource.description = $scope.expositionDescription;
                createExpositionResource.expectedAudience = $scope.expectedAudience;
                createExpositionResource.minFeedBack = $scope.minFeedBack;
                createExpositionResource.$save(function (result) {
                    $scope.expositionName = '';
                    $scope.expositions.push(result);
                    $location.path("/exposition/")
                });
            }
        };

        $scope.reset = function () {
            $scope.$broadcast('show-errors-reset');
            $scope.expositionName = "";
            $scope.expositionDate = "";
            $scope.expositionFromTime = "";
            $scope.expositionToTime = "";
            $scope.expositionVenue = "";
            $location.path("/exposition/create/")
        };


        $scope.findExposition = function (_id) {
            $scope.expositionUpdateService = new ExpositionUpdateService();
            $scope.expositionUpdateService.$get({id: _id}, function (result) {
                $scope.exposition = result;
            });
        };

        $scope.updateExposition = function (_id) {
            $scope.expositionUpdateService = new ExpositionUpdateService();
            if($scope.exposition.offer){
                $scope.expositionUpdateService.offer = $scope.exposition.offer;
            }else{
                $scope.expositionUpdateService.displayName = $scope.displayName;
            }
            $scope.expositionUpdateService.$update({id: _id}, function (result) {
                $location.path("/exposition/");
            });
        };

        $scope.deleteExposition = function (_id) {
            $scope.expositionUpdateService.$delete({id: _id}, function (result) {
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

        $scope.uploadOffer = function (file) {
            Upload.upload({
                url: '/uploadImage',
                data: {file: file, 'username': $scope.username}
            }).then(function (resp) {
                var fileName = resp.data.split('/')[3];
                $scope.exposition.offer.photo = fileName;
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
