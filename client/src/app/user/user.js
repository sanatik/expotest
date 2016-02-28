/**
 * Created by bosone on 2/28/16.
 */
var userApp = angular.module('users', ['ngResource', 'ui.router', 'angularMoment', 'user.services']);

userApp.config(['$stateProvider', '$urlRouterProvider',

    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('user', {
                url: "/user/me/",
                templateUrl: 'app/user/info.tpl.html',
                controller: 'UserController'
            })
            .state('userid', {
                url: "/user/:id/",
                templateUrl: 'app/user/info.tpl.html',
                controller: 'UserController'
            });
    }
]);

userApp.controller('UserController', ['$scope', '$resource', '$state', '$location', 'UserService',
    function ($scope, $resource, $state, $location, UserService) {

        var loadUser = function () {
            if ($state.params.id) {
                UserService.findOne($state.params.id).then(function (result) {
                    $scope.user = result.data;
                }, function () {

                });
            }
        };

        if (!$scope.user) {
            loadUser();
        }
    }
]);