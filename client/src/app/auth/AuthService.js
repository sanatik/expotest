/**
 * Created by Serikuly_S on 09.02.2016.
 */
var authServices = angular.module('auth.services', ['ngResource']);

authServices.factory('AuthServices', ['$http', 'AuthToken', function ($http, AuthToken) {
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
        },
        getUser: function () {
            if (AuthToken.getToken()) {
                return $http.get('/api/me', {cache: true});
            } else {
                return $q.reject({message: 'User has no token.'});
            }
        }
    }
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
    }
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
            if (response.status == 403) {
                AuthToken.setToken();
                $location.path('/login');
            }
            return $q.reject(response);
        }
    }
}]);