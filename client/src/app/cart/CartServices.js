/**
 * Created by Serikuly_S on 26.02.2016.
 */

var services = angular.module('cart.services', []);

module.factory('CartService', ['$http', function ($http) {
    return {
        add: function (offer) {
            return $http.post('/cart/add', offer);
        },
        getAll: function () {
            return $http.get('/cart');
        },
        remove: function (id) {
            return $http.delete('/cart/' + id);
        },
        pay: function (id) {
            return $http.post('/cart/pay/' + id);
        },
        approveList: function () {
            return $http.get('/cart/approveList');
        },
        cancel: function (id) {
            return $http.post('/cart/cancel/' + id);
        },
        approve: function (id) {
            return $http.post('/cart/approve/' + id);
        }
    }
}]);
