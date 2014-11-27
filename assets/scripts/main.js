'use strict';

var angular = require('angular');
var uiRoute = require('angular-ui-router');
var _ = require('underscore');
require('./token/tokenHolder');
require('./token/tokenModule');
require('./trelloBoardsService');
require('./boards/boardsModule');
require('./members/membersModule');
require('./users/usersModule');


function routes($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'views/welcome.tpl.html'
        })
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
                    return TrelloBoards.getBoards().then(function(response){
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
                members: ['$stateParams', 'TrelloBoards', function($stateParams, TrelloBoards){
                    return TrelloBoards
                                .getMembers($stateParams.boardId)
                                .then(function(response){
                                    return response.data;
                                });
                }]
            }
        })
    ;


    $urlRouterProvider.otherwise('/');
}

angular.module('TrelloStandUpRandomizer', 
    [uiRoute, 'TrelloBoardsService', 'TokenHolderModule','TrelloToken', 'TrelloBoardsModule', 'MembersModule', 'UsersModule'])
    .config(routes)
    .run(function($state, TrelloBoards, TokenHolder, UsersRepository){
        TrelloBoards.getKey().then(function(response){
            TokenHolder.key = response.data;
        });

        UsersRepository.getUser()
            .then(function(response){
                if(_.isUndefined(response.email)) {
                    $state.transitionTo('index');
                } else if(_.isUndefined(response.token) || _.isNull(response.token)) {
                    $state.transitionTo('token');
                } else {
                    $state.transitionTo('boards');
                }
            });
    });
