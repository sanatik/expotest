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