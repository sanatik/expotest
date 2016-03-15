/**
 * Created by bosone on 2/3/16.
 */
var module = angular.module('exposition.services', ['ngResource']);

module.factory('ExpositionService', ['$http', '$window', function ($http, $window) {
        return {
            findAll: function () {
                return $http.get('/exposition');
            },
            findOne: function (id) {
                $("#loader").show();
                return $http.get('/exposition/' + id).then(function (result) {
                    $("#loader").hide();
                    return result.data;
                }, function () {

                });
            },
            save: function (expostion) {
                return $http.post('/exposition', expostion);
            },
            edit: function (id, exposition) {
                return $http.put('/exposition/' + id, exposition);
            },
            delete: function (id) {
                return $http.delete('/exposition/' + id);
            },
            respond: function (expositionId, offerId, data) {
                $("#loader").show();
                return $http.post('/exposition/respond/' + expositionId + '/' + offerId, data).then(function (data) {
                    $("#loader").hide();
                    var responds = $window.localStorage.getItem('responds');
                    if (!responds) {
                        responds = [];
                    }
                    responds.push({exposition: expositionId, offer: offerId});
                    $window.localStorage.setItem('responds', JSON.stringify(responds));
                    return data.data;
                });
            },
            statistic: function (expositionId, offerId) {
                $("#loader").show();
                return $http.post('/exposition/statistic/' + expositionId + '/' + offerId).then(function (data) {
                    $("#loader").hide();
                    return data.data;
                });
            },
            checkRespond: function (expositionId, offerId, callback) {
                var responds = $window.localStorage.getItem('responds');
                responds = JSON.parse(responds);
                var res = false;
                for(var i in responds){
                    var respond = responds[i];
                    if(respond.exposition === expositionId && respond.offer === offerId){
                        res = true;
                        break;
                    }
                }
                callback(res);
            }
        };
    }]);