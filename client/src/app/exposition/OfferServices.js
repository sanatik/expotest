/**
 * Created by bosone on 2/3/16.
 */
var module = angular.module('offer.services', ['ngResource']);

module.factory('OfferUpdateService', function ($resource) {
    return $resource('exposition/:id/offer/:oId',
        {
            id: '@id'
        },
        {
            oId: '@oId'
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