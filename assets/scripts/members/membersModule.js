'use strict';

var angular = require('angular');
var _ = require('underscore');

function MembersCtrl(members){
    var ctrl = this;

    function shuffle() {
        ctrl.members = _.shuffle(ctrl.members);
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
