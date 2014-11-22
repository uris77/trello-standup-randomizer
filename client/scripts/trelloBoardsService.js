'use strict';

var angular = require('angular');

function TrelloBoards($http) {
    return {
        getMembers: function(boardId, token) {
            return $http.get('/trello/members/'+boardId+'/'+token);
        },
        getBoards: function(token){
            return $http.get('/trello/boards/' + token);
        }
    };
}

angular.module('TrelloBoardsService', [])
    .factory('TrelloBoards', TrelloBoards);