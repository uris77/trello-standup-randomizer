"use strict";

var Trello = require("node-trello");
var TRELLO_KEY = "a8aa4b5a500aa17c02b8e15cb09a9e2b";
var t = new Trello("a8aa4b5a500aa17c02b8e15cb09a9e2b", "06a11bfa9f9cc6e410f18d3d8a76b1b5c93567a593834a1cdd121228faa43585");

t.get("/1/members/me", function(err, data){
	if(err) throw err;
	console.log(data);
});