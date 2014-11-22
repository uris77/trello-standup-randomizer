'use strict';

var angular = require('angular');
var uiRoute = require('angular-ui-router');
require('./token/tokenHolder');
require('./token/tokenModule');
require('./trelloBoardsService');
require('./boards/boardsModule');
require('./members/membersModule');


function routes($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('token', {
			url: '/token',
			templateUrl: 'views/token.tpl.html',
			controller: 'TokenCtrl',
			controllerAs: 'tokenCtrl'
		})
		.state('boards', {
			url: '/boards',
			templateUrl: 'views/boards.tpl.html',
			controller: 'TrelloBoardsCtrl',
			controllerAs: 'boardsCtrl',
			resolve: {
				boards: ['TokenHolder', 'TrelloBoards', function(TokenHolder, TrelloBoards){
					return TrelloBoards.getBoards(TokenHolder.token).then(function(response){
						return response.data;
					});
				}],
				token: ['TokenHolder', function(TokenHolder){
					return TokenHolder.token;
				}]
			}
		})
		.state('members', {
			url: '/members/:boardId',
			templateUrl: 'views/members.tpl.html',
			controller: 'MembersCtrl',
			controllerAs: 'membersCtrl',
			resolve: {
				members: ['$stateParams', 'TokenHolder', 'TrelloBoards', function($stateParams, TokenHolder, TrelloBoards){
					return TrelloBoards
								.getMembers($stateParams.boardId, TokenHolder.token)
								.then(function(response){
									return response.data;
								});
				}]
			}
		})
	;


	$urlRouterProvider.otherwise('/token');
}

angular.module('TrelloStandUpRandomizer', 
	[uiRoute, 'TrelloBoardsService', 'TokenHolderModule','TrelloToken', 'TrelloBoardsModule', 'MembersModule'])
	.config(routes)
	.run(function(){
	});
