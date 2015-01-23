'use strict';

var angular = require('angular');
var _ = require('underscore');

function TrelloBoardsCtrl(boards, token, TrelloBoards) {
    var ctrl = this;
   
    return _.extend(ctrl, {
        boards: boards,
        token: token
    });
}

module.exports = angular.module("TrelloBoardsModule", ['TrelloBoardsService'])
                    .controller('TrelloBoardsCtrl', TrelloBoardsCtrl);


