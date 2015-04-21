var cosine = require('cosine');
var jaccard = require('jaccard');

module.exports = function(Utility) {
    var checkedItems = [];
    
    this.getItems = function() {
        return checkedItems;
    }

    this.addItem = function(item) {
        item.checked = !item.checked;
        var index = checkedItems.indexOf(item);
        if (index === -1)
            checkedItems.push(item);
        else {
            checkedItems.splice(index,1);
        }
        if (checkedItems.length > 5) {
            var overflowItem = checkedItems.shift();
            overflowItem.checked = !overflowItem.checked;
        }
    }

    this.cleanItems = function() {
        checkedItems.map(function(item) {
            item.checked = false;
        })
        checkedItems = [];
    }
    
    this.sort = function(documents) {
        if (checkedItems.length === 0)
            return;
        var query = Utility.parseItems(checkedItems);
        Utility.sortItems(query, documents, cosine);
    }
    
    this.jaccard = function(documents) {
        if (checkedItems.length === 0)
            return;
        var query = Utility.parseItems(checkedItems, true); // second parameter is for bag of words
        Utility.sortItems(query, documents, jaccard.index, true);
    }
}
