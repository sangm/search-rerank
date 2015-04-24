var angular = require('angular');
var _ = require('lodash');

angular.module('app', []);
// services
require('./service');

angular.module('app')
    .controller("SearchController", function(SearchService, ItemService, Utility, $scope) {
        $scope.addItem = ItemService.addItem;

        $scope.calcOptions = [
            {value: "cosine", desc: "Cosine Similarity", use: true},
            {value: "jaccard", desc: "Jaccard Coefficient", use: false}
        ]
        
        $scope.changeCalcOption = function(calc) {
            if (calc.use)
                return;
            var opt = Utility.filterOptions($scope.calcOptions)
            calc.use = !calc.use;
            opt.use = !opt.use;
        }
        
        $scope.filterQuery = function(query) {
            return function(q) {
                return q.title.match(query) || q.snippet.match(query);
            }
        }
        $scope.search = function(query) {
            if (!query || query.length === 0)
                return;
            /*
            $scope.results = SearchService.testSearch();
            */
            SearchService.searchTerm(query).then(function(results) {
                $scope.results = results;
            })
        }
        
        $scope.rerank = function() {
            var opt = Utility.filterOptions($scope.calcOptions);
            if (opt.value === "cosine") {
                ItemService.sort($scope.results);
            }
            else if (opt.value === "jaccard") {
                ItemService.jaccard($scope.results);
            }
            ItemService.cleanItems();
        }
    })
