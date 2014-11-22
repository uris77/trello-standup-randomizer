'use strict';

var angular = require('angular');

function tokenHolder() {
	var token;
	return {
		token:  token
	};
}

module.exports = angular.module('TokenHolderModule', [])
						.factory('TokenHolder', tokenHolder);