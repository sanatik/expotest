/**
 * Created by bosone on 2/28/16.
 */
var module = angular.module('user.services', ['ngResource']);

module.factory('UserService', ['$http', function ($http) {
    return {
        findOne: function (id) {
            return $http.get('/user/' + id);
        }
    }
}]);