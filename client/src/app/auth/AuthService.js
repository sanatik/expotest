/**
 * Created by Serikuly_S on 09.02.2016.
 */
var authServices = angular.module('auth.services', ['ngResource']);

authServices.factory('AuthServices', ['$http', 'AuthToken', '$rootScope', function ($http, AuthToken, $rootScope) {
        return {
            login: function (data) {
                return $http.post('/auth/login', data).success(function (data) {
                    AuthToken.setToken(data.token);
                    return data;
                }).error(function () {

                });
            },
            signup: function (data, success, error) {
                $http.post('/auth/signup', data).success(success).error(error);
            },
            isLoggedIn: function () {
                if (AuthToken.getToken()) {
                    return true;
                } else {
                    return false;
                }
            },
            logout: function () {
                AuthToken.setToken();
                $rootScope.currentUser = {};
            },
            getUser: function () {
                return $http.get('/auth/me', {cache: true});
            },
            hasRole: function (name) {
                return $http.get('/auth/hasRole', {params: {roleName: name}});
            },
            isOwner: function (id) {
                var owner = false;
                this.getUser().then(function (data) {
                    if (data.name === id) {
                        owner = true;
                    }
                });
                return owner;
            }
        };
    }]).factory('AuthToken', ['$window', function ($window) {
        return {
            getToken: function () {
                return $window.localStorage.getItem('token');
            },
            setToken: function (token) {
                if (token) {
                    $window.localStorage.setItem('token', token);
                }
                else {
                    $window.localStorage.removeItem('token');
                }
            }
        };
    }]).factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function ($q, $location, AuthToken) {

        return {
            request: function (config) {
                var token = AuthToken.getToken();
                if (token) {
                    config.headers['x-access-token'] = token;
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 403) {
                    AuthToken.setToken();
                }
                return $q.reject(response);
            }
        };
    }]);


var PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
authServices.directive('phone', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (PHONE_REGEX.test(viewValue)) {
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});