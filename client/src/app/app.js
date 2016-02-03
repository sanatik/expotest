/**
 * Created by bosone on 2/3/16.
 */
angular.module('app', [
        'ngResource',
        'ui.router',
        'ngCookies',
        'expositions'
    ]
);

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "app/index.tpl.html",
            controller: 'AppCtrl'
        });

}]);

angular.module('app').controller('HeaderCtrl', ['$scope','$location','AuthService', function($scope,$location,AuthService) {

}]);