'use strict';

var componentController = function () {
	const ctrl = this;
};

angular.module('rooms')
	.component('roomUser', {
		bindings: {
			user: '<',

			hideKick: '<',
			enableReady: '<',

			onKick: '&?',
			onReady: '&?',
		},
		templateUrl: 'app/rooms/room/room-user/room-user.html',
		controller: componentController
	});
