var stemmer = require('porter-stemmer').stemmer;
var cosine = require('cosine');
var stopwords = require('stopwords').english;
var jaccard = require('jaccard');
var _ = require('lodash');

module.exports = function() {
    this.combine = function(document) {
        return document.snippet + document.title;
    }

    this.tokenize = function(document, bag) {
        console.log(document)
        document = document.toLowerCase().split(/\s+/).filter(function(word) {
            return stopwords.indexOf(word) === -1;
        }).map(function(word) {
            return stemmer(word);
        });
        if (bag)
            document = _.uniq(document);
        return document;
    }
    
    this.cosine = function(query, document) {
        return cosine(query, document);
    }
    
    this.parseItems = function(items, bag) {
        var self = this;
        var items = this.tokenize(items.map(function(item) {
            return self.combine(item);
        }).join(), bag)
        return items;
    }
    
    this.sortItems = function(query, items, sortFunc, bag) {
        var self = this;
        items.sort(function(a, b) {
            var scoreA, scoreB;
            a = self.tokenize(self.combine(a), bag);
            b = self.tokenize(self.combine(b), bag);
            scoreA = sortFunc(query, a);
            scoreB = sortFunc(query, b);
            
            if (scoreA > scoreB)
                return -1;
            if (scoreA < scoreB)
                return 1;
            return 0;
        })
    }
    
    this.filterOptions = function(calcOptions) {
        return _.find(calcOptions, function(option) {
            return option.use === true;
        })
    }
}
