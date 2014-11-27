'use strict';

var angular = require('angular');
require('./token/tokenHolder');

function TrelloBoards($q, $http, $state, TokenHolder) {
    return {
        getMembers: function(boardId) {
            return $http.get('/standup/members/'+boardId);
        },
        getBoards: function(){
            return $http.get('/standup/boards/');
        },
        getKey: function() {
        	return $http.get('/trello/key');
        },
        saveToken: function(params) {
        	var deferred = $q.defer();
        	deferred.promise = $http.post('/standup/token', params)
        			.then(function(response){
        				TokenHolder.token = response.data.user.token;
        				return response.data.user;
        			}, function(response){
        				if(response.status === 401) {
        					$state.redirectTo('index');
        				}
        				return {};
        			});
        	return deferred.promise;
        }
    };
}

module.exports = angular.module('TrelloBoardsService', ['TokenHolderModule'])
    				.factory('TrelloBoards', TrelloBoards);