/**
 * Created by Serikuly_S on 09.02.2016.
 */
var authApp = angular.module('auth', ['ngResource', 'ui.router', 'auth.services']);

authApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider.state('auth', {
            url: '/auth/',
            templateUrl: 'app/auth/login.tpl.html',
            controller: 'AuthController'
        }).state('authsignup', {
            url: '/auth/signup/',
            templateUrl: 'app/auth/signup.tpl.html',
            controller: 'AuthController'
        });
    }
]);

authApp.controller('AuthController', ['$scope', '$resource', '$state', '$location', 'AuthServices', '$rootScope',
    function ($scope, $resource, $state, $location, AuthServices, $rootScope) {
        $scope.loginFormData = {};
        $scope.user = {};
        $scope.user.additional = [];

        $scope.signup = function () {
            AuthServices.signup(this.user,
                function (data) {
                    if (data.message === 'OK') {
                        $location.path('/auth/');
                    } else {
                        alert(data.message);
                    }
                },
                function (data) {
                    alert(data.message);
                })
        };
        $scope.upload = function (image) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var readyImg = resizeImg(reader.result);
                document.getElementById('avatar-img').setAttribute('src', readyImg);
                $scope.user.avatar = readyImg;
            }, false);

            if (image) {
                reader.readAsDataURL(image);
            }
        };
        $scope.additionalField = function () {
            $scope.user.additional.push({});
        };

        function resizeImg(file) {
            var canvas = document.createElement('canvas');
            var img = new Image();
            img.src = file;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 200;
            var MAX_HEIGHT = 300;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL("image/png");
            return dataurl;
        }
    }])
;