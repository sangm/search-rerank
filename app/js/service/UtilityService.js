var stemmer = require('porter-stemmer').stemmer;
var cosine = require('cosine');

module.exports = function() {
    this.combine = function(document) {
        return document.snippet + document.title;
    }

    this.tokenize = function(document) {
        return document.toLowerCase().split(/\s+/);
    }

    this.stemming = function(document) {
        return stemmer(document);
    }
    
    this.cosine = function(query, document) {
        return cosine(query, document);
    }
    
    this.parseItems = function(items) {
        var self = this;
        return this.tokenize(items.map(function(item) {
            return self.stemming(self.combine(item));
        }).join());
    }
    
    this.sortItems = function(query, items) {
        var self = this;
        items.sort(function(a, b) {
            var scoreA, scoreB;
            a = self.tokenize(self.combine(a));
            b = self.tokenize(self.combine(b));
            scoreA = self.cosine(query, a);
            scoreB = self.cosine(query, b);
            
            if (scoreA > scoreB)
                return -1;
            if (scoreA < scoreB)
                return 1;
            return 0;
        })
    }
}
