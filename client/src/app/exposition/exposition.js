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
                    controller: 'ExpositionsController',
                    data: {
                        permissions: {
                            only: ['organizer'],
                            redirectTo: function () {
                                return 'exposition';
                            }
                        },
                        css: ['css/kick.css',
                            'http://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css',
                            'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
                            'vendor/text-angular/dist/textAngular.css']
                    }
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
                    templateUrl: 'app/exposition/create.tpl.html',
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
        ['$scope', '$state', '$location', 'ExpositionService', '$window', '$filter', '$rootScope', 'AuthServices', 'OfferService', 'CartService', '$q', 'UserService', 'Upload', '$document', 'pdfDelegate',
            function ($scope, $state, $location, ExpositionService, $window, $filter, $rootScope, AuthServices, OfferService, CartService, $q, UserService, Upload, $document, pdfDelegate) {
                var loadExpositions = function (params, loadMore) {
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
                                if (data.data.length < 5) {
                                    $scope.loadMoreFilterShow = false;
                                }
                                if (loadMore) {
                                    $scope.expositions = $scope.expositions.concat(data.data);

                                } else {
                                    $scope.expositions = data.data;
                                }
                                $('.grid').masonry({
                                    itemSelector: '.grid_item',
                                    columnWidth: 250,
                                    gutter: 30
                                });
                            },
                            function () {
                            });
                };

                $scope.findExposition = function (url) {
                    ExpositionService.findOne(url).then(function (data) {
                        $scope.exposition = data;
                        if ($scope.exposition && $scope.exposition.presentation && $scope.exposition.presentation.filename) {
                            $scope.loadPDFFile('img/pdf/' + $scope.exposition.presentation.filename);
                        }
                        if ($scope.exposition.startDate) {
                            if ($scope.exposition.endDate) {
                                var filter = 'd MMM';
                                var startDate = new Date($scope.exposition.startDate);
                                var endDate = new Date($scope.exposition.endDate);
                                if (startDate.getMonth() === endDate.getMonth()) {
                                    filter = 'd';
                                }
                                $scope.exposition.startDateString = $filter('date')($scope.exposition.startDate, filter);
                                $scope.exposition.endDateString = $filter('date')($scope.exposition.endDate, 'd MMMM yyyy г.');
                                var oneDay = 24 * 60 * 60 * 1000;
                                var todayDate = new Date();
                                $scope.exposition.daysDiff = Math.round(Math.abs((startDate.getTime() - todayDate.getTime()) / (oneDay)));
                                if ($state.current.name === 'expositionedit') {
                                    var filter = 'dd-MM-yyyy';
                                    $scope.exposition.startDate = $filter('date')($scope.exposition.startDate, filter);
                                    $scope.exposition.endDate = $filter('date')($scope.exposition.endDate, filter);
                                }
                            }
                        }
                        if ($state.current.name === 'expositionstatistic') {
                            $scope.getStatistic($scope.exposition._id, $scope.exposition.offers[0]._id);
                            for (var i in $scope.exposition.offers) {
                                if ($scope.hasAccessToStatistics($scope.exposition, $scope.exposition.offers[i])) {
                                    $scope.chosenOfferId = $scope.exposition.offers[i]._id;
                                    break;
                                }
                            }

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
                        $('.grid').masonry({
                            itemSelector: '.grid_item',
                            columnWidth: 250,
                            gutter: 30
                        });
                    }, function () {
                    });
                };
                $scope.formats = [{id: 1, name: 'Выставка'}, {id: 2, name: 'Премия'}, {id: 3, name: 'Конференция'}, {id: 4, name: 'Форум'}];
                $scope.loadMoreFilterShow = true;
                $scope.loadExpos = function (loadMore) {
                    var params = {};
                    if ($scope.filter.month) {
                        params.month = $scope.filter.month;
                    }
                    if ($scope.filter.year) {
                        params.year = $scope.filter.year;
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
                    if ($scope.filter.themes) {
                        params.themes = [];
                        params.themes = params.themes.concat($scope.filter.themes);
                    }
                    if ($scope.filter.offset) {
                        params.offset = $scope.filter.offset;
                    }
                    loadExpositions(params, loadMore);
                };

                $scope.loadMore = function () {
                    $scope.filter.offset = $scope.filter.offset + 5;
                    $scope.loadExpos(true);
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
                    loadExpositions({}, false);
                }
                $scope.offer = {};
                $scope.autocompleteOptions = {
                    types: ['(regions)']
                };
                $scope.showPresentation = true;
                $scope.filter = {};
                $scope.filter.month = 0;
                $scope.filter.year = 0;
                $scope.filter.format = 0;
                $scope.filter.offset = 0;
                $scope.filter.themes = [];
                $scope.chosenThemes = [];

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

                $scope.applyToAdditional = function (i, additional) {
                    $scope.exposition.additionals[i] = additional;
                }

                $scope.addAdditional = function () {
                    $scope.exposition.additionals.push('');
                }

                $scope.removeAdditional = function (index) {
                    $scope.exposition.additionals.splice(index, 1);
                }
                $scope.loadTags(1);
                if ($state.current.name === 'expositioncreate') {
                    $scope.createExpositionAction = true;
                    $scope.exposition = {};
                    $scope.exposition.presentation = {};
                    $scope.exposition.photo = {};
                    $scope.exposition.themes = [];
                    $scope.exposition.additionals = [];
                }

                $scope.createExposition = function () {
                    if ($scope.expositionCreateForm !== 'undefined' && validateCreateUpdateForm()) {
                        if (this.exposition) {
                            ExpositionService.save(this.exposition).then(function (result) {
                                if (result.errors) {
                                    return;
                                }
                                $location.path("/exposition/");
                            }, function () {
                            });
                        }
                    }
                };

                function validateCreateUpdateForm() {
                    if ($scope.exposition) {
                        if ($scope.exposition.photo.filename) {
                            return true;
                        }
                    }
                    return false;
                }

                $scope.resetFilter = function () {
                    $scope.filter = {};
                    $scope.filter.month = 0;
                    $scope.filter.year = 0;
                    $scope.filter.format = 0;
                    $scope.filter.themes = [];
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

                $scope.upload = function (file) {
                    var reader = new FileReader();
                    reader.addEventListener("load", function () {
                        var readyImg = resizeImg(reader.result);
                        document.getElementById("photo-preview").setAttribute('src', readyImg);
                        Upload.upload({
                            url: '/uploadImage',
                            data: {file: dataURLtoBlob(readyImg), 'username': $scope.username}
                        }).then(function (resp) {
                            console.log(resp.data);
                            var fileName = resp.data;
                            if (!$scope.exposition.photo) {
                                $scope.exposition.photo = {};
                            }
                            $scope.exposition.photo.filename = fileName;
                            $("#photoSpan").text(resp.config.data.file.name);
                            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                };

                $scope.uploadPresentation = function (file) {
                    if (file.type === 'application/pdf') {
                        Upload.upload({
                            url: '/uploadPDF',
                            data: {file: file, 'username': $scope.username}
                        }).then(function (resp) {
                            console.log(resp.data);
                            var fileName = resp.data;
                            if (!$scope.exposition.presentation) {
                                $scope.exposition.presentation = {};
                            }
                            $scope.exposition.presentation.filename = fileName;
                            $scope.loadPDFFile('img/pdf/' + fileName);
                            $scope.showErrorPres = false;
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });
                    } else {
                        $scope.showErrorPres = true;
                    }

                };

                $scope.back = function () {
                    $window.history.back();
                };
                $scope.newUser = {};
                $scope.respond = function (id, oId, answer) {
                    if (AuthServices.isLoggedIn()) {
                        //check what is filled
                        $rootScope.checkCurrentUser(function (data) {
                            if (data.message === 'ok') {
                                checkIfInfoIsFull(id, oId, answer);
                            } else {
                                $scope.newUser = {};
                                $scope.showUserForm = true;
                            }
                        });
                    } else {
                        if ($scope.showUserForm === true && $scope.newUser.email && $scope.newUser.password) {
                            AuthServices.login({username: $scope.newUser.email, password: $scope.newUser.password}).success(function (data) {
                                console.log(data === 'OK');
                                if (data.message === 'OK') {
                                    checkIfInfoIsFull(id, oId, answer);
                                } else {
                                    ExpositionService.respond(id, oId, {answer: answer, newUser: $scope.newUser}).then(function (data) {
                                        if (data.success === true) {
                                            $scope.showUserRespond(false);
                                            $scope.answer = {};
                                            alert("Спасибо за фидбек. Ваш голос принят.");
                                        }
                                    });
                                }
                            });
                        } else {
                            $scope.newUser = {};
                            $scope.showUserRespond(true);
                        }
                    }
                };

                function checkIfInfoIsFull(id, oId, answer) {
                    UserService.findOne($rootScope.currentUser.userId).then(function (user) {
                        //if full info, answer
                        if (user.position && user.company && user.city) {
                            ExpositionService.respond(id, oId, {answer: $scope.answer}).then(function (data) {
                                if (data.success === true) {
                                    $scope.showUserRespond(false);
                                    $scope.answer = {};
                                    alert("Спасибо за фидбек. Ваш голос принят.");
                                }
                            });
                        } else {
                            //if not full show form without password
                            $scope.newUser = user;
                            $scope.showUserRespond(true);
                        }
                    });
                }

                $scope.showUserRespond = function (showUserForm) {
                    if (showUserForm === true) {
                        $('#new-test').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 100).addClass('active');
                        $('.shadow_overlay').fadeIn(100);
                    } else {
                        $('#mobile-nav .hidden-menu').slideUp(150);
                        $('#mobile-nav .show_elements_button').removeClass('active');
                        $('.shadow_overlay').fadeOut(150);
                        $('#themes').css('opacity', '1').animate({opacity: 0}, 150, function () {
                            $('#themes').css('visibility', 'hidden').removeClass('active');
                        });
                    }
                    $scope.showUserForm = showUserForm;
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
                    var data = {};
                    if ($scope.filter && $scope.filter.location) {
                        data.location = $scope.filter.location;
                    }
                    ExpositionService.statistic(expositionId, offerId, data).then(function (data) {
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
                    });
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
                    $('#themes').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 100).addClass('active');
                    $('.shadow_overlay').fadeIn(100);
                    $scope.choseThemeFilterWindowOpen = true;
                };
                $scope.choseThemes = function (theme) {
                    var i = $scope.checkChosenTheme(theme);
                    if (i) {
                        $scope.exposition.themes.splice(i, 1);
                    } else {
                        $scope.exposition.themes.push(theme);
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
                    if ($scope.exposition && $scope.exposition.themes) {
                        for (var i in $scope.exposition.themes) {
                            var t = $scope.exposition.themes[i];
                            if (theme._id === t._id) {
                                return i;
                            }
                        }
                    }
                    return false;
                };

                $scope.chooseThemesFilter = function (theme) {
                    var i = $scope.checkChosenThemeFilter(theme);
                    if (i) {
                        $scope.filter.themes.splice(i, 1);
                    } else {
                        $scope.filter.themes.push(theme);
                    }
                    var j = $scope.checkChosenThemes(theme);
                    if (j) {
                        console.log($scope.chosenThemes[j].inactive);
                        if ($scope.chosenThemes[j].inactive && $scope.chosenThemes[j].inactive === true) {
                            $scope.chosenThemes[j].inactive = false;
                        } else {
                            $scope.chosenThemes[j].inactive = true;
                        }
                    } else {
                        $scope.chosenThemes.push(theme);
                    }
                    if ($scope.filter.themes.length > 0) {
                        $scope.activeChoseThemeButton = true;
                    } else {
                        $scope.activeChoseThemeButton = false;
                    }
                    if ($scope.choseThemeFilterWindowOpen) {

                    } else {
                        $scope.loadExpos();
                    }
                };

                $scope.checkChosenThemes = function (theme) {
                    for (var i in $scope.chosenThemes) {
                        var t = $scope.chosenThemes[i];
                        if (theme._id === t._id) {
                            return i;
                        }
                    }
                    return false;
                };

                $scope.checkChosenThemeFilter = function (theme) {
                    for (var i in $scope.filter.themes) {
                        var t = $scope.filter.themes[i];
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
                    $('#themes').css('opacity', '1').animate({opacity: 0}, 150, function () {
                        $('#themes').css('visibility', 'hidden').removeClass('active');
                    });
                };

                $scope.closeThemeFilter = function () {
                    $('#mobile-nav .hidden-menu').slideUp(150);
                    $('#mobile-nav .show_elements_button').removeClass('active');
                    $('.shadow_overlay').fadeOut(150);
                    $('#themes').css('opacity', '1').animate({opacity: 0}, 150, function () {
                        $('#themes').css('visibility', 'hidden').removeClass('active');
                    });
                    $scope.choseThemeFilterWindowOpen = false;
                    $scope.loadExpos();
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

                $scope.hasAccessToStatistics = function (exposition, offer) {
                    return ($rootScope.hasRole(1) && $rootScope.isOwner(exposition.creator))
                            || ($rootScope.hasRole(2) && $rootScope.isOwner(offer.creator));
                };
                $document.ready(function () {
                    $scope.showCreateForm = true;
                });

                $scope.loadPDFFile = function (url) {
                    console.log(123123123123123);
                    pdfDelegate
                            .$getByHandle('my-pdf-container')
                            .load(url);
                    return true;
                };

                $scope.switchTabs = function (tabNo) {
                    if (tabNo === 1) {
                        $scope.showAboutAuditory = false;
                        $scope.showPresentation = true;
                    } else {
                        $scope.showAboutAuditory = true;
                        $scope.showPresentation = false;
                    }
                };

                function resizeImg(file) {
                    var canvas = document.createElement('canvas');
                    var img = new Image();
                    img.src = file;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var MAX_WIDTH = 600;
                    var MAX_HEIGHT = 600;
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

                function dataURLtoBlob(dataurl) {
                    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], {type: mime});
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
