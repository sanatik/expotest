/**
 * Created by Serikuly_S on 09.02.2016.
 */
var authApp = angular.module('auth', ['ngResource', 'ui.router', 'auth.services']);

authApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider.
            state('auth', {
                url: '/auth/',
                templateUrl: 'app/index.tpl.html',
                controller: 'AuthController'
            });
    }
]);

authApp.controller('AuthController', ['$scope', '$resource', '$state', '$location', 'AuthServices',
    function ($scope, $resource, $state, $location, AuthServices) {
        $scope.loginFormData = {};
        $scope.login = function () {
            if ($scope.loginForm) {
                AuthServices.login(this.loginFormData, function (data) {
                        console.log(data);
                    },
                    function (data) {
                        console.log(data);
                    });
            } else {
                console.log('11');
            }
        };
    }]);