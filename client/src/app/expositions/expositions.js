/**
 * Created by bosone on 2/3/16.
 */
angular.module('expositions', ['ngResource', 'ui.router', 'exposition.services', 'angularMoment']);

angular.module('expositions').config(['$stateProvider', '$urlRouterProvider',

    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('exposition', {
                url: "/expositions/",
                templateUrl: 'app/expositions/list.tpl.html',
                controller: 'ExpositionController'
            })
            .state('expositioncreate', {
                url: "/exposition/create/",
                templateUrl: 'app/expositions/create.tpl.html',
                controller: 'ExpositionController'
            })
            .state('expositionview', {
                url: "/exposition/:id/",
                templateUrl: 'app/expositions/details.tpl.html',
                controller: 'ExpositionController'
            })
            .state('expositionedit', {
                url: "/exposition/:id/edit/",
                templateUrl: 'app/expositions/edit.tpl.html',
                controller: 'ExpositionController'
            });
    }
]);

angular.module('expositions').factory('socket', function () {
    var socket = io.connect("http://localhost:3000/exposition");
    return socket;
});


angular.module('expositions').controller('ExpositionsController', ['$scope', '$resource', '$state', '$location', 'ExpositionUpdateService', 'socket',
    function ($scope, $resource, $state, $location, ExpositionUpdateService, socket) {
        var ExpositionResource = $resource('/exposition/:id'); //this will be the base URL for our rest express route.
        $scope.appname = "Mean Demo";
        $scope.expositionUpdateService = new ExpositionUpdateService();
        var loadExpositions = function () {
            return ExpositionResource.query(function (results) {
                $scope.expositions = results;
                if ($state.params.id) {
                    $scope.findExposition($state.params.id);
                }
            });
        }

        socket.on('new exposition', function (data) {
            loadExpositions();
        });

        socket.on('edit exposition', function (data) {
            loadExpositions();
        });

        socket.on('delete exposition', function (data) {
            loadExpositions();
        });


        if (!$scope.expositions) {
            loadExpositions();
        }

        $scope.createExposition = function () {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.expositionCreateForm.$valid) {
                var createExpositionResource = new ExpositionResource();
                createExpositionResource.name = $scope.expositionName;
                createExpositionResource.date = new Date($scope.expositionDate);
                createExpositionResource.fromTime = $scope.expositionFromTime;
                createExpositionResource.toTime = $scope.expositionToTime;
                createExpositionResource.venue = $scope.expositionVenue;

                createExpositionResource.$save(function (result) {
                    $scope.expositionName = '';
                    socket.emit('exposition added', result);
                    $scope.expositions.push(result);
                    $location.path("/exposition/")
                });
            }
        }

        $scope.reset = function () {
            $scope.$broadcast('show-errors-reset');
            $scope.expositionName = "";
            $scope.expositionDate = "";
            $scope.expositionFromTime = "";
            $scope.expositionToTime = "";
            $scope.expositionVenue = "";
            $location.path("/exposition/create/")
        }


        $scope.findExposition = function (_id) {
            $scope.expositionUpdateService = new ExpositionUpdateService();
            $scope.expositionUpdateService.$get({id: _id}, function (result) {
                $scope.exposition = result;
            });
        }

        $scope.updateExposition = function (_id) {
            $scope.expositionUpdateService = new ExpositionUpdateService();
            $scope.expositionUpdateService.name = $scope.exposition.name;
            $scope.expositionUpdateService.$update({id: _id}, function (result) {
                socket.emit('exposition updated', result);
                $location.path("/exposition/")
            });
        }

        $scope.getExposition = function (_id) {
            $scope.expositionUpdateService.$get({id: _id}, function (result) {
                $scope.exposition = result;
                $location.path("/exposition/" + _id + "/")
            });
            $scope.exposition
        }

        $scope.deleteExposition = function (_id) {
            $scope.expositionUpdateService.$delete({id: _id}, function (result) {
                socket.emit('exposition deleted', result);
                $location.path("/exposition/")
            });
        }
    }
]);
