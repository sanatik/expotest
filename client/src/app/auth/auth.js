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
        $('.shadow_overlay').fadeOut(100);
        $scope.loginFormData = {};
        $scope.user = {};
        $scope.user.avatar = {};
        $scope.user.additional = [];

        $scope.signup = function () {
            $("#loader").show();
            AuthServices.signup(this.user,
                    function (data) {
                        if (data.message === 'OK') {
                            $location.path('/auth/');
                        } else {
                            $("#message").html(data.message).show();
                        }
                        $("#loader").hide();
                    },
                    function () {
                        $("#loader").hide();
                    });
        };
        $scope.uploadPhoto = function (image) {
            var reader = new FileReader();
            var type = 'image/png';
            reader.addEventListener("load", function () {
                var readyImg = resizeImg(reader.result);
                document.getElementById("photo-preview").setAttribute('src', readyImg);
                readyImg = readyImg.replace(type, "");
                readyImg = readyImg.replace("data:", "");
                readyImg = readyImg.replace(";base64,", "");
                $scope.user.avatar.content = readyImg;
                $scope.user.avatar.type = type;
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

            var MAX_WIDTH = 100;
            var MAX_HEIGHT = 100;
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