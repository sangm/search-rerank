var angular = require('angular');
var cosine = require('cosine');
var stemmer = require('porter-stemmer').stemmer;
var _ = require('lodash');
var googleData = require('./service.js')

angular.module('app', [])
    .service('SearchService', function($http, $q) {
        this.query = function(query, start) {
            return $http.get('https://www.googleapis.com/customsearch/v1?key=AIzaSyDZVACn5_asHlircCDxgoEL594xEyTqQN0&cx=017576662512468239146:omuauf_lfve&q=' + query + '&num=10&start=' + start);
        }
        this.searchTerm = function(query) {
            return $q.all([
                this.query(query, 1),
                this.query(query, 20)])
                .then(function(data) {
                    var googleData = _.union(data[0].data.items, data[1].data.items)
                    googleData.forEach(function(result, index) {
                        result.index = index;
                    });
                    return googleData;
                })
        } 
    })
    .service('Utility', function() {
        this.combine = function(document) {
            return document.snippet + document.title;
        }
        this.tokenize = function(document) {
            return document.toLowerCase().split(/\s+/);
        }
    })
    .controller("SearchController", function(SearchService, Utility, $scope) {
        $scope.calcOptions = ["Cosine Similarity", "Jaccard Coefficient"]
        $scope.filterQuery = function(query) {
            return function(q) {
                return q.title.match(query) || q.snippet.match(query);
            }
        }
        $scope.search = function(query) {
            if (!query || query.length === 0)
                return;
            SearchService.searchTerm(query).then(function(results) {
                $scope.results = results;
            })
        }
        $scope.checkedItems = [];
        $scope.rerank = function() {
            if ($scope.checkedItems.length === 0)
                return;
            var query = Utility.tokenize($scope.checkedItems.map(function(item) {
                return stemmer(Utility.combine(item))
            }).join());
            var documents = $scope.results.sort(function(a, b) {
                var scoreA, scoreB;
                a = Utility.tokenize(Utility.combine(a));
                b = Utility.tokenize(Utility.combine(b));
                scoreA = cosine(query, a);
                scoreB = cosine(query, b);
                
                if (scoreA > scoreB)
                    return -1;
                if (scoreA < scoreB)
                    return 1;
                return 0;
            })
            $scope.cleanItems();
        }

        $scope.addItem = function(item) {
            item.checked = !item.checked;
            var index = $scope.checkedItems.indexOf(item);
            if (index === -1)
                $scope.checkedItems.push(item);
            else {
                $scope.checkedItems.splice(index,1);
            }
            if ($scope.checkedItems.length > 5) {
                var overflowItem = $scope.checkedItems.shift();
                overflowItem.checked = !overflowItem.checked;
            }
        }
        $scope.cleanItems = function() {
            $scope.checkedItems.map(function(item) {
                item.checked = false;
            })
            $scope.checkedItems = [];
        }
        /*
        $scope.$watch('searchQuery', function(query) {
            SearchService.searchTerm(query).then(function(data) {
                $scope.results = data;
            })
        })
        */
    })


