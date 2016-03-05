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
                })
                .state('useredit', {
                    url: "/user/edit/:id/",
                    templateUrl: 'app/user/edit.tpl.html',
                    controller: 'UserController'
                })
                .state('userall', {
                    url: "/users/all/",
                    templateUrl: 'app/user/list.tpl.html',
                    controller: 'UserController'
                });
    }
]);

userApp.controller('UserController', ['$scope', '$state', '$location', 'UserService', '$rootScope',
    function ($scope, $state, $location, UserService, $rootScope) {

        var loadUser = function () {
            if ($state.params.id || $state.current.name === 'user') {
                $rootScope.checkCurrentUser(function (data) {
                    if (data.message === 'ok') {
                        var id = $rootScope.currentUser.userId;
                        if ($state.params.id) {
                            id = $state.params.id;
                        }
                        UserService.findOne(id).then(function (result) {
                            $scope.user = result;
                        });
                    }
                });
            }
        };

        var loadUsers = function () {
            if ($state.current.name === 'userall') {
                UserService.findAll().then(function (result) {
                    if (result.success) {
                        $scope.users = result.users;
                    } else {
                        $("#message").html(result.message).show();
                    }
                });
            }
        };

        if (!$scope.user) {
            loadUser();
        }

        if (!$scope.users) {
            loadUsers();
        }

        $scope.edit = function (id) {
            if ($scope.user) {
                UserService.edit(id, $scope.user).then(function (result) {
                    if (result.success === true) {
                        $location.path('/user/me');
                    } else {
                        $("#message").html(result.message).show();
                    }
                });
            }
        };

        $scope.lock = function (id) {
            UserService.lock(id).then(function (result) {
                if (result.success === true) {
                    $state.reload();
                } else {
                    $("#message").html(result.message).show();
                }
            });
        };

        $scope.buyPremium = function () {
            UserService.buyPremium().then(function (result) {
                if (result.success === true) {
                    $location.path('/user/me');
                } else {
                    $("#message").html(result.message).show();
                }
            });
        };
    }
]);