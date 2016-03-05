/**
 * Created by Serikuly_S on 26.02.2016.
 */
var cartApp = angular.module('cart', ['ngResource', 'permission', 'ui.router', 'auth.services', 'cart.services', 'offer.services']);

expositionApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
                .state('cart', {
                    url: "/cart/add/:expId/",
                    templateUrl: 'app/cart/addItem.tpl.html',
                    controller: 'CartController'
                })
                .state('cartview', {
                    url: "/cart/",
                    templateUrl: 'app/cart/cart.tpl.html',
                    controller: 'CartController'
                })
                .state('cartapprove', {
                    url: '/cart/approve/',
                    templateUrl: 'app/cart/approveList.tpl.html',
                    controller: 'CartController'
                });
    }
]);

expositionApp.controller('CartController', ['$scope', 'CartService', '$location', '$state', 'OfferService', function ($scope, CartService, $location, $state, OfferService) {

        var loadCart = function () {
            $("#loader").show();
            CartService.getAll().then(
                    function (data) {
                        $scope.cart = data.data;
                        $("#loader").hide();
                        if ($state.params.expId) {
                            $("#loader").show();
                            $scope.expositionId = $state.params.expId;
                            OfferService.findAll().then(function (data) {
                                $scope.offers = data.data;
                                $("#loader").hide();
                            }, function () {
                                $("#message").html("Произошла ошибка").show();
                                $("#loader").hide();
                            });
                        }
                    }, function () {
                $("#loader").hide();
                $("#message").html("Произошла ошибка").show();
            });
        };
        var loadApproveList = function () {
            $("#loader").show();
            CartService.approveList().then(function (result) {
                $scope.approveList = result.data;
                $("#loader").hide();
            }, function () {
                $("#loader").hide();
                $("#message").html("Error loading approve list").show();
            });
        };

        if ($state.current.name === 'cartapprove') {
            if (!$scope.approveList) {
                loadApproveList();
            }
        } else {
            if (!$scope.cart) {
                loadCart();
            }
        }


        $scope.addCartItem = function () {
            if ($scope.offer && $scope.expositionId) {
                $("#loader").show();
                CartService.add({offerId: $scope.offer._id, expositionId: $scope.expositionId}).then(function (data) {
                    if (data.data.success === true) {
                        $location.path('/cart/');
                    } else {
                        $("#message").html(data.data.message).show();
                    }
                    $("#loader").hide();
                }, function () {
                    $("#loader").hide();
                    $("#message").html("Error creating offer").show();
                });
            }
        };

        $scope.deleteCartItem = function (id) {
            $("#loader").show();
            CartService.remove(id).then(function (result) {
                if (result.data.success === true) {
                    $state.reload();
                } else {
                    $("#message").html(result.data.message).show();
                }
                $("#loader").hide();
            }, function () {
                $("#loader").hide();
                $("#message").html("Error deleting cart item").show();
            });
        };

        $scope.pay = function (cartId) {
            $("#loader").show();
            CartService.pay(cartId).then(function (result) {
                if (result.data.success === true) {
                    $state.reload();
                } else {
                    $("#message").html(result.data.message).show();
                }
                $("#loader").hide();
            }, function () {
                $("#loader").hide();
                $("#message").html("Error on paying cart item").show();
            });
        };

        $scope.approve = function (cartId) {
            $("#loader").show();
            CartService.approve(cartId).then(function (result) {
                if (result.data.success === true) {
                    $state.reload();
                } else {
                    $("#message").html(result.data.message).show();
                }
                $("#loader").hide();
            }, function () {
                $("#loader").hide();
                $("#message").html("Error on approve cart item").show();
            });
        };

        $scope.cancelItem = function (cartId) {
            $("#loader").show();
            CartService.cancel(cartId).then(function (result) {
                if (result.data.success === true) {
                    $state.reload();
                } else {
                    $("#message").html(result.data.message).show();
                }
                $("#loader").hide();
            }, function () {
                $("#loader").hide();
                $("#message").html("Error on cancel cart item").show();
            });
        };
    }]);