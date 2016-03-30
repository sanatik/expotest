/**
 * Created by bosone on 2/3/16.
 */
angular.module('app', [
    'ngResource',
    'ngCookies',
    'expositions',
    'offers',
    'permission',
    'ui.router',
    'ngFileUpload',
    'auth',
    'auth.services',
    'cart',
    'users',
    'google.places'
]).run(function (RoleStore, AuthServices, $q) {
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
    RoleStore.defineRole('admin', [], function () {
        var deferred = $q.defer();
        AuthServices.hasRole('admin').success(function (result) {
            if (result.hasRole === true) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });
        return deferred.promise;
    });
});
angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise("/");
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);
angular.module('app').controller('AppCtrl', ['$scope', '$location', '$rootScope', 'AuthServices', '$q', function ($scope, $location, $rootScope, AuthServices, $q) {
        $rootScope.isOwner = function (id) {
            var owner = false;
            if (AuthServices.isLoggedIn()) {
                $rootScope.checkCurrentUser(function (data) {
                    if (data) {
                        if (data.message === 'ok') {
                            owner = $rootScope.currentUser.userId === id;
                        }
                    }
                });
            }
            return owner;
        };
        $rootScope.checkCurrentUser = function (callback) {
            if (!$rootScope.currentUser) {
                AuthServices.getUser().success(function (data) {
                    if (data.username) {
                        $rootScope.currentUser = data;
                        return callback({message: "ok"});
                    } else {
                        $rootScope.currentUser = false;
                        callback({message: "not found"});
                    }

                }).error(function () {
                    $rootScope.currentUser = false;
                    callback({message: "not found"});
                });
            } else {
                callback({message: "ok"});
            }
        };
        $rootScope.hasRole = function (role) {
            var hasRole = false;
            if (AuthServices.isLoggedIn()) {
                $rootScope.checkCurrentUser(function (data) {
                    if (data) {
                        if (data.message === 'ok') {
                            hasRole = $rootScope.currentUser.role === role;
                        }
                    }
                });
            }
            return hasRole;
        };
    }]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$rootScope', 'AuthServices', '$timeout', function ($scope, $location, $rootScope, AuthServices, $timeout) {
        AuthServices.getUser().success(function (data) {
            $rootScope.currentUser = data;
        }).error(function () {
            $rootScope.currentUser = false;
        });
        $rootScope.logout = function () {
            AuthServices.logout();
            $rootScope.currentUser = false;
            window.location.reload();
        };

        $rootScope.login = function () {
            AuthServices.login(this.loginFormData)
                    .success(function (data) {
                        if (data.message === 'OK') {
                            AuthServices.getUser().success(function (data) {
                                $timeout(function () {
                                    $rootScope.$apply(function () {
                                        $rootScope.currentUser = data;
                                    });

                                });
                                $location.path('/exposition/');
                                window.location.reload();
                            }).error(function () {
                                $rootScope.currentUser = false;
                                alert("Error on login");
                            });
                        } else {
                            alert(data.message);
                        }
                    });
        };
    }]);