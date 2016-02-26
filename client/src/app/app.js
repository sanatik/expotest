/**
 * Created by bosone on 2/3/16.
 */
angular.module('app', [
    'ngResource',
    'ngCookies',
    'expositions',
    'offers',
    'permission',
    'ui.router',
    'ngFileUpload',
    'auth',
    'auth.services',
    'cart'
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
            return $rootScope.currentUser.userId === id;
        }
        return false;
    };
}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$rootScope', 'AuthServices', '$timeout', function ($scope, $location, $rootScope, AuthServices, $timeout) {
    AuthServices.getUser().success(function (data) {
        $rootScope.currentUser = data;
    }).error(function () {
        $rootScope.currentUser = false;
    });
    $rootScope.logout = function () {
        AuthServices.logout();
        $rootScope.currentUser = false;
        window.location.reload();
    };

    $rootScope.login = function () {
        AuthServices.login(this.loginFormData)
            .success(function (data) {
                if (data.message === 'OK') {
                    AuthServices.getUser().success(function(data){
                        $timeout(function() {
                            $rootScope.$apply(function () {
                                $rootScope.currentUser = data;
                            });

                        });
                        $location.path('/exposition/');
                    }).error(function(){
                        $rootScope.currentUser = false;
                        alert("Error on login");
                    });
                } else {
                    alert(data.message);
                }
            });
    };
}]);