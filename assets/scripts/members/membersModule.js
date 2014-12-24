'use strict';

var angular = require('angular');
var _ = require('underscore');

function MembersCtrl($interval, members){
    var ctrl = this;

    function _shuffle() {
        ctrl.members = _.shuffle(ctrl.members);
    }

    function shuffle() {
        ctrl.shuffling = true;
        ctrl.shuffleId = $interval(_shuffle, 200);
    }

    function stopShuffling() {
        ctrl.shuffling = false;
        if(angular.isDefined(ctrl.shuffleId)) {
            $interval.cancel(ctrl.shuffleId);
            ctrl.shuffleId = undefined;
        }

    }

    return _.extend(ctrl,{
        shuffling: false,
        shuffle: shuffle,
        stopShuffling: stopShuffling,
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
