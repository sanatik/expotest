/**
 * Created by bosone on 2/3/16.
 */
var module = angular.module('exposition.services', ['ngResource']);

module.factory('ExpositionUpdateService', function ($resource) {
    return $resource('exposition/:id',
        {
            id: '@id'
        },
        {
            'update': {method: 'PUT'}
        },
        {
            'get': {method: 'GET', isArray: false}
        },
        {
            'delete': {method: 'DELETE'}
        }
    );
});
module.factory('ExpositionService', ['$http', function ($http) {
    return {
        findAll: function () {
            return $http.get('/exposition');
        },
        findOne: function (id) {
            return $http.get('/exposition/' + id);
        },
        save: function (expostion) {
            return $http.post('/exposition', expostion);
        },
        edit: function (id, exposition) {
            return $http.put('/exposition/' + id, exposition);
        },
        delete: function (id) {
            return $http.delete('/exposition/' + id);
        }
    }
}]);