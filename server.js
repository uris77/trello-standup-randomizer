"use strict";

var Hapi = require('hapi');
var Path = require('path');
var Trello = require('node-trello');

var config = require('./config.js');

function getTrelloBoards(token, reply) {
	var t = new Trello(config.trello.key, token);
	t.get('/1/members/me/boards', function(err, data){
		reply(data);
	});
}

function getBoardMembers(boardId, token, reply) {
	var t = new Trello(config.trello.key, token);
	t.get('/1/boards/' + boardId + '/members?fields=all', function(err, data){
		reply(data);
	});
}

//var server = new Hapi.Server('localhost', 3000, {files: {relativeTo: Path.join(__dirname, 'public')}});
var server = new Hapi.Server(3000);

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: 'public',
			index: true
		}
	}
});

server.route({
	method: 'GET',
	path: '/trello/boards/{token}',
	handler: function(request, reply) {
		if(request.params.token) {
			getTrelloBoards(request.params.token, reply);
		} else {
			reply({error: 'No Token Provided!'});
		}
	}
});

server.route({
	method: 'GET',
	path: '/trello/members/{boardId}/{token}',
	handler: function(request, reply){
		if(request.params.token && request.params.boardId) {
			getBoardMembers(request.params.boardId, request.params.token, reply);
		} else {
			reply({error: 'No token or board id provided!'});
		}
	}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});