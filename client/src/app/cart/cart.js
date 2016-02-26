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
            });
    }
]);

expositionApp.controller('CartController', ['$scope', 'CartService', '$location', '$state', 'OfferService', function ($scope, CartService, $location, $state, OfferService) {

    var loadCart = function () {
        CartService.getAll().then(
            function (data) {
                $scope.cart = data.data;
                if($state.params.expId){
                    $scope.expositionId = $state.params.expId;
                    OfferService.findAll().then(function(data){
                        $scope.offers = data.data;
                    }, function(){
                        alert("Error loading offers");
                    })
                }
            }, function () {
                alert("Error loading expositions");
            });
    };

    if (!$scope.cart) {
        loadCart();
    }

    $scope.addCartItem = function () {
        if ($scope.offer && $scope.expositionId) {
            CartService.add({offerId: $scope.offer._id, expositionId: $scope.expositionId}).then(function (data) {
                if (data.data.success === true) {
                    $location.path('/cart/');
                } else {
                    alert("Error creating offer");
                }
            }, function () {
                alert("Error creating offer");
            })
        }
    };

    $scope.deleteCartItem = function(id){
        CartService.remove(id).then(function(result){
            if(result.data.success === true){
                $state.reload();
            }else{
                alert("Error deleting cart item");
            }
        }, function(){
            alert("Error deleting cart item");
        })
    }
}]);