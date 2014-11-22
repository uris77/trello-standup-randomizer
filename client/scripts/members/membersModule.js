'use strict';

var angular = require('angular');
var _ = require('underscore');

function MembersCtrl(members){
	var ctrl = this;

	function shuffle() {
		var currentIndex = ctrl.members.length, temporaryValue, randomIndex ;

	  	// While there remain elements to shuffle...
	  	while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = ctrl.members[currentIndex];
		    ctrl.members[currentIndex] = ctrl.members[randomIndex];
		    ctrl.members[randomIndex] = temporaryValue;
	  	}
	}

	return _.extend(ctrl,{
		shuffle: shuffle,
		members: _.map(members, function(member){
			if(member.avatarHash) {
				member.avatarUrl = "https://trello-avatars.s3.amazonaws.com/" + member.avatarHash + '/170.png';
			} else {
				member.avatarUrl = "/img/unknown.jpg";
			}
			
			return member;
		})
	});
}

module.exports = angular
					.module('MembersModule', [])
					.controller('MembersCtrl', MembersCtrl);
