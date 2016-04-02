/**
 * Created by bosone on 2/3/16.
 */
var expositionApp = angular.module('expositions', ['ngResource', 'permission', 'ui.router', 'exposition.services', 'angularMoment', 'offer.services', 'auth.services', 'wu.masonry']);

expositionApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
                .state('exposition', {
                    url: "/",
                    templateUrl: "app/index.tpl.html",
                    controller: 'ExpositionsController'
                })
                .state('expositionmy', {
                    url: "/exposition/my/",
                    templateUrl: "app/index.tpl.html",
                    controller: 'ExpositionsController'
                })
                .state('expositioncreate', {
                    url: "/exposition/create/",
                    templateUrl: 'app/exposition/create.tpl.html',
                    controller: 'ExpositionsController'
                })
                .state('expositionview', {
                    url: "/exposition/:id/",
                    templateUrl: 'app/exposition/details.tpl.html',
                    controller: 'ExpositionsController'
                })
                .state('expositionstatistic', {
                    url: "/exposition/:id/statistics/",
                    templateUrl: 'app/exposition/userlist.tpl.html',
                    controller: 'ExpositionsController'
                })
                .state('expositionedit', {
                    url: "/exposition/:id/edit/",
                    templateUrl: 'app/exposition/edit.tpl.html',
                    controller: 'ExpositionsController'
                })
                .state('expositiooffersview', {
                    url: "/exposition/:id/offers/",
                    templateUrl: 'app/exposition/offerList.tpl.html',
                    controller: 'ExpositionsController'
                })
                .state('expositiooffersviewoffer', {
                    url: "/exposition/:id/offers/:oId/",
                    templateUrl: 'app/exposition/offerDetails.tpl.html',
                    controller: 'ExpositionsController'
                });
    }
]);

expositionApp.controller('ExpositionsController',
        ['$scope', '$state', '$location', 'ExpositionService', '$window', '$filter', '$rootScope', 'AuthServices', 'OfferService', 'CartService', '$q',
            function ($scope, $state, $location, ExpositionService, $window, $filter, $rootScope, AuthServices, OfferService, CartService, $q) {
                var loadExpositions = function (params) {
                    ExpositionService.findAll(params).then(
                            function (data) {
                                for (var i in data.data) {
                                    var exposition = data.data[i];
                                    if (exposition.startDate) {
                                        if (exposition.endDate) {
                                            var filter = 'd MMM';
                                            var startDate = new Date(exposition.startDate);
                                            var endDate = new Date(exposition.endDate);
                                            if (startDate.getMonth() === endDate.getMonth()) {
                                                filter = 'd';
                                            }
                                            exposition.startDateString = $filter('date')(exposition.startDate, filter);
                                            exposition.endDateString = $filter('date')(exposition.endDate, 'd MMMM yyyy г.');
                                        }

                                    }
                                }
                                $scope.expositions = data.data;
                                $('.grid').masonry({
                                    itemSelector: '.grid_item',
                                    columnWidth: 250,
                                    gutter: 30
                                });
                            },
                            function () {
                                $("#loader").hide();
                                $("#message").html("Error loading expositions").show();
                            });
                };

                $scope.findExposition = function (url) {
                    ExpositionService.findOne(url).then(function (data) {
                        $scope.exposition = data;
                        if ($state.current.name === 'expositionstatistic') {
                            $scope.getStatistic($scope.exposition._id, $scope.exposition.offers[0]._id);
                            $scope.chosenOfferId = $scope.exposition.offers[0]._id;
                        }
                        if ($state.params.oId) {
                            var offers = $scope.exposition.offers;
                            var o = {};
                            for (var i = 0; i < offers.length; i++) {
                                var offer = offers[i];
                                if (offer._id === $state.params.oId) {
                                    o = offer;
                                    break;
                                }
                            }
                            $scope.offer = o;
                        }
                    }, function () {
                        $("#message").html("Error loading expositions").show();
                    });
                };

                $scope.loadExpos = function () {
                    var params = {};
                    if ($scope.filter.month) {
                        params.month = $scope.filter.month;
                    }
                    if ($scope.filter.location) {
                        params.location = $scope.filter.location;
                    }
                    if ($scope.filter.format) {
                        params.format = $scope.filter.format;
                    }
                    if ($scope.filter.my) {
                        params.my = $scope.filter.my;
                    }
                    loadExpositions(params);
                };

                $scope.letters = [];
                $scope.loadTags = function () {
                    ExpositionService.getTags().then(function (d) {
                        var letters = $scope.letters;
                        var data = d.data;
                        $scope.tags = [];
                        for (var i in data) {
                            var theme = data[i];
                            if (theme.name) {
                                if (theme.name.charAt(0)) {
                                    if ($.inArray(theme.name.charAt(0), letters) === -1) {
                                        letters.push(theme.name.charAt(0));
                                    }
                                }
                            }

                        }
                        $scope.letters = letters;
                        $scope.themes = data;
                    });
                };

                if (!$scope.expositions &&
                        ($state.current.name === 'exposition'
                                )) {
                    loadExpositions({});
                }
                $scope.offer = {};
                $scope.autocompleteOptions = {
                    types: ['(regions)']
                };
                $scope.filter = {};
                $scope.filter.month = 0;
                $scope.filter.format = 0;

                if ($state.current.name === 'expositionmy') {
                    $scope.filter.my = true;
                    $scope.loadExpos();
                }
                if (!$scope.exposition &&
                        ($state.current.name === 'expositionview'
                                || $state.current.name === 'expositionedit'
                                || $state.current.name === 'expositiooffersview'
                                || $state.current.name === 'expositiooffersviewoffer'
                                || $state.current.name === 'expositionstatistic')) {
                    if ($state.params.id) {
                        $scope.findExposition($state.params.id);
                    }
                }
                if ($state.current.name === 'expositioncreate') {
                    $scope.loadTags(1);
                    $scope.exposition = {};
                    $scope.exposition.presentation = {};
                    $scope.exposition.photo = {};
                    $scope.exposition.themes = [];
                }

                $scope.createExposition = function () {

                    if ($scope.expositionCreateForm !== 'undefined') {
                        if (this.exposition) {
                            $("#loader").show();
                            ExpositionService.save(this.exposition).then(function (result) {
                                if (result.errors) {
                                    $("#loader").hide();
                                    $("#message").html(result.errors).show();
                                    return;
                                }
                                $location.path("/exposition/");
                            }, function () {
                                $("#loader").hide();
                                $("#message").html("Error on creating expostion").show();
                            });
                        }
                    }
                };

                $scope.resetFilter = function () {
                    $scope.filter = {};
                    $scope.filter.month = 0;
                    $scope.filter.format = 0;
                    $scope.loadExpos();
                };

                $scope.updateExposition = function (_id) {
                    if (this.exposition) {
                        ExpositionService.edit(_id, this.exposition).then(function () {
                            $location.path("/exposition/" + _id + "/");
                        }, function () {
                            alert("Error on editing expostion");
                        });
                    }
                };

                $scope.deleteExposition = function (_id) {
                    ExpositionService.delete(_id).then(function () {
                        $location.path("/exposition/");
                    }, function () {
                        alert("Error on deleting expostion");
                    });
                };

                $scope.reset = function () {
                    $scope.exposition = {};
                    $location.path("/exposition/create/");
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
                        $scope.exposition.photo.content = readyImg;
                        $scope.exposition.photo.type = type;
                    }, false);

                    if (image) {
                        reader.readAsDataURL(image);
                    }
                };

                $scope.uploadPresentation = function (file) {
                    var reader = new FileReader();
                    reader.addEventListener("load", function () {
                        var presentationBase64 = reader.result;
                        document.getElementById("presentation-name").textContent = "123";
                        presentationBase64 = presentationBase64.replace(file.type, "");
                        presentationBase64 = presentationBase64.replace("data:", "");
                        presentationBase64 = presentationBase64.replace(";base64,", "");
                        $scope.exposition.presentation.content = presentationBase64;
                        $scope.exposition.presentation.type = file.type;
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                };

                $scope.back = function () {
                    $window.history.back();
                };
                $scope.newUser = {};
                $scope.respond = function (id, oId, answer) {
                    if ($scope.newUser.displayName) {
                        ExpositionService.respond(id, oId, {answer: answer, newUser: $scope.newUser}).then(function (data) {
                            if (data.success === true) {
                                $scope.showUserForm = false;
                                $scope.answer = {};
                                alert("Спасибо за фидбек. Ваш голос принят.");
                            }
                        });
                    } else {
                        if (AuthServices.isLoggedIn()) {
                            ExpositionService.respond(id, oId, {answer: $scope.answer}).then(function (data) {
                                if (data.success === true) {
                                    $scope.showUserForm = false;
                                    $scope.answer = {};
                                    alert("Спасибо за фидбек. Ваш голос принят.");
                                }
                            });
                        } else {
                            $scope.showUserForm = true;
                            $scope.answer = answer;
                        }
                    }
                };

                $scope.checkRespond = function (expositionId, offerId) {
                    var result = false;
                    ExpositionService.checkRespond(expositionId, offerId, function (res) {
                        result = res;
                    });
                    return result;
                };

                $scope.getStatistic = function (expositionId, offerId) {
                    if (!offerId) {
                        offerId = $scope.chosenOfferId;
                    }
                    ExpositionService.statistic(expositionId, offerId).then(function (data) {
                        if (data.success === true) {
                            $scope.statistic = data.result;
                            $scope.positive = data.positive;
                        }
                    });
                };

                $scope.generateLetter = function () {
                    var offers = $scope.exposition.offers;
                    var html = '<html>';
                    html += '<table>';
                    for (var i in offers) {
                        var offer = offers[i];
                        html += '<tr><td>';
                        html += offer.name;
                        html += '</td><td>';
                        html += offer.description;
                        html += '</td></tr>';
                    }
                    html += '</table></html>';
                    $scope.letter = html;
                    $scope.showLetter = true;
                };

                $scope.onChangeFilterIndex = function () {
                    $('button.reset-button').addClass('submitted');
                    $('button.submit-button').removeClass('not-submitted');
                };

                $scope.redirect = function (expositionId) {
                    $('#new-test').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 100).addClass('active');
                    $('.shadow_overlay').fadeIn(100);
                    OfferService.findAll().then(function (data) {
                        $scope.offers = data.data;
                        $scope.expositionId = expositionId;
                    }, function () {
                        alert("Error on loading offers");
                    });
                    //$location.path(url);
                };

                $scope.locationPath = function (url) {
                    $location.path(url);
                };

                $scope.addCartItem = function () {
                    if ($scope.activeChoseOfferButton && $scope.offerId && $scope.expositionId) {
                        CartService.add({offerId: $scope.offerId, expositionId: $scope.expositionId}).then(function (data) {
                            if (data.data.success === true) {
                                $('.shadow_overlay').fadeOut(150);
                                $location.path('/cart/');
                            }
                        });
                    }
                };
                $scope.chooseOffer = function (index, offerId) {
                    $scope.chosenOffer = index;
                    $scope.offerId = offerId;
                    $scope.activeChoseOfferButton = true;
                };
                $scope.showThemes = function () {
                    $('#new-test').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 100).addClass('active');
                    $('.shadow_overlay').fadeIn(100);
                };
                $scope.choseThemes = function (theme) {
                    var i = $scope.checkChosenTheme(theme);
                    if (i) {
                        $scope.exposition.themes.splice(i, 1);
                    } else {
                        $scope.exposition.themes.push(theme);
                        console.log(theme);
                        if (theme.tags) {
                            if ($scope.tags) {
                                $scope.tags = arrayUnique($scope.tags.concat(theme.tags));
                            } else {
                                $scope.tags = theme.tags;
                            }
                        }
                    }
                    if ($scope.exposition.themes.length > 0) {
                        $scope.activeChoseThemeButton = true;
                    } else {
                        $scope.activeChoseThemeButton = false;
                    }

                };

                $scope.checkChosenTheme = function (theme) {
                    for (var i in $scope.exposition.themes) {
                        var t = $scope.exposition.themes[i];
                        if (theme._id === t._id) {
                            return i;
                        }
                    }
                    return false;
                };

                $scope.closeTheme = function () {
                    $('#mobile-nav .hidden-menu').slideUp(150);
                    $('#mobile-nav .show_elements_button').removeClass('active');
                    $('.shadow_overlay').fadeOut(150);
                    $('#new-test').css('opacity', '1').animate({opacity: 0}, 150, function () {
                        $('#new-test').css('visibility', 'hidden').removeClass('active');
                    });
                };

                $scope.findTag = function ($query) {
                    var deferred = $q.defer();
                    var tags = [];
                    if ($scope.tags) {
                        tags = $scope.tags;
                    }
                    deferred.resolve(tags);
                    return deferred.promise;
                };

                function resizeImg(file) {
                    var canvas = document.createElement('canvas');
                    var img = new Image();
                    img.src = file;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var MAX_WIDTH = 250;
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
                function arrayUnique(array) {
                    var a = array.concat();
                    for (var i = 0; i < a.length; ++i) {
                        for (var j = i + 1; j < a.length; ++j) {
                            if (a[i] === a[j])
                                a.splice(j--, 1);
                        }
                    }

                    return a;
                }

            }
        ]);
