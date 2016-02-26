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
        }
    }
}]);
