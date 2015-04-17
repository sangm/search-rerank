var angular = require('angular');
var _ = require('lodash');

angular.module('app', []);
// services
require('./service');

angular.module('app')
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
            var query = Utility.parseItems($scope.checkedItems);
            Utility.sortItems(query, $scope.results);
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


