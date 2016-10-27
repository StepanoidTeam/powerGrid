'use strict';

var componentController = function () {
	var ctrl = this;


	
	
};

angular.module('rooms')
	.component('room', {
		bindings: {
			roomId: '<'
		},
		templateUrl: 'app/rooms/room/room.html',
		controller: componentController
	});