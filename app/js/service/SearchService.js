var _ = require('lodash');

module.exports = function($http, $q) {
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
    this.testSearch = function() {
        var googleData = require('../data/GoogleData.js')
        googleData.items.forEach(function(result, index) {
            result.index = index;
        });
        return googleData.items
    }
}
