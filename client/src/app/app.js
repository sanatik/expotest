/**
 * Created by bosone on 2/3/16.
 */
angular.module('app', [
    'ngResource',
    'ngCookies',
    'expositions',
    'permission',
    'ui.router',
    'ngFileUpload',
    'auth',
    'auth.services'
]);
angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "app/index.tpl.html",
            controller: 'AppCtrl'
        });
    $httpProvider.interceptors.push('AuthInterceptor');
}]);
angular.module('app').controller('AppCtrl', ['$scope', '$location', '$rootScope', 'AuthServices', function ($scope, $location, $rootScope, AuthServices) {
    $rootScope.isOwner = function (id) {
        if($rootScope.currentUser){
            return $rootScope.currentUser.id === id;
        }
        return false;
    }
}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$rootScope', 'AuthServices', function ($scope, $location, $rootScope, AuthServices) {
    AuthServices.getUser().success(function (data) {
        $rootScope.currentUser = data;
    }).error(function () {
        $rootScope.currentUser = false;
    });
    $rootScope.logout = function () {
        AuthServices.logout();
        $rootScope.currentUser = false;
        $location.path('/');
    }
}]);