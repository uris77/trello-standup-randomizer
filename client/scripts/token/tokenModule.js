'use strict';

var angular = require('angular'); 
var _ = require('underscore');
require('./tokenHolder');
require('../trelloBoardsService');

function TokenCtrl($state,  TokenHolder, TrelloBoards) {
    var ctrl = this;
    function saveToken() {
        TrelloBoards.saveToken({token: ctrl.token})
            .then(function(user) {
                if(user.token) $state.go('boards');
            });
    }

    return _.extend(ctrl, {
        token: '',
        saveToken: saveToken
    });
}

module.exports = angular.module('TrelloToken', ['TokenHolderModule', 'TrelloBoardsService'])
    .controller('TokenCtrl', TokenCtrl);
