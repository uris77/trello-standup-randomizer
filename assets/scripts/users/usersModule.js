'use strict';

var angular = require('angular');

function UsersRepository($q, $http) {
	function getUser() {
		var deferred = $q.defer();

		deferred.promise = $http.get('/trello/user')
								.then(function(response){
									return response.data.user;
								}, function(response){
									console.log('failed: ', response);
									return {};
								});
		return deferred.promise;
	}

	return {
		getUser: getUser
	};
}


module.exports = angular
					.module('UsersModule', [])
					.factory('UsersRepository', UsersRepository);