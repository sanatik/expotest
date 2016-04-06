/**
 * Created by bosone on 2/28/16.
 */
var module = angular.module('user.services', ['ngResource']);

module.factory('UserService', ['$http', function ($http) {
        return {
            findOne: function (id) {
                return $http.get('/user/' + id).then(function (response) {
                    return response.data;
                });
            },
            edit: function (id, user) {
                $("#loader").show();
                return $http.post('/user/edit/' + id, user).then(function (response) {
                    $("#loader").hide();
                    return response.data;
                }, function () {
                    $("#message").html("Произошла ошибка").show();
                    $("#loader").hide();
                });
            },
            lock: function (id) {
                $("#loader").show();
                return $http.post('/user/lock/' + id).then(function (response) {
                    $("#loader").hide();
                    return response.data;
                }, function () {
                    $("#message").html("Произошла ошибка").show();
                    $("#loader").hide();
                });
            },
            buyPremium: function () {
                $("#loader").show();
                return $http.post('/user/buyPremium').then(function (response) {
                    $("#loader").hide();
                    return response.data;
                }, function () {
                    $("#message").html("Произошла ошибка").show();
                    $("#loader").hide();
                });
            },
            findAll: function () {
                $("#loader").show();
                return $http.get('/user').then(function (response) {
                    $("#loader").hide();
                    return response.data;
                }, function () {
                    $("#message").html("Произошла ошибка").show();
                    $("#loader").hide();
                });
            }
        };
    }]);