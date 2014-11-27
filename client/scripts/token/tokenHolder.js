'use strict';

var angular = require('angular');

function tokenHolder() {
    var token;
    var key;
    return {
        token:  token,
        key: key
    };
}

module.exports = angular.module('TokenHolderModule', [])
                        .factory('TokenHolder', tokenHolder);