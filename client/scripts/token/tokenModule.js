'use strict';

var angular = require('angular'); 
var _ = require('underscore');
require('./tokenHolder');

function TokenCtrl($state, 	TokenHolder) {
	var ctrl = this;
	function saveToken() {
		TokenHolder.token = ctrl.token;
		$state.go('boards');
	}

	return _.extend(ctrl, {
		token: '',
		saveToken: saveToken
	});
}

module.exports = angular.module('TrelloToken', ['TokenHolderModule'])
	.controller('TokenCtrl', TokenCtrl);
