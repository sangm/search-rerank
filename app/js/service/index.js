var angular = require('angular');

angular.module('app')
    .service('SearchService', require('./SearchService'))
    .service('Utility', require('./UtilityService'))
    .service('ItemService', require('./ItemService'))
