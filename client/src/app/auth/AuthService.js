/**
 * Created by Serikuly_S on 09.02.2016.
 */
var authServices = angular.module('auth.services', ['ngResource']);

authServices.factory('AuthServices', ['$http', function ($http) {
    return {
        login: function (data, success, error) {
            $http.post('/auth/login', data).success(success).error(error);
        },
        signup: function (data, success, error) {
            $http.post('/auth/signup', data).success(success).error(error);
        }
    }
}]);