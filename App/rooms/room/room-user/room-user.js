'use strict';

var componentController = function () {
	const ctrl = this;


	ctrl.getAvatarIcon = function (user = {Id: ''}) {
		return user.Id.indexOf('bot') < 0 ? 'face' : 'android';
	};

	ctrl.changeColor = () => ctrl.onColorChange(ctrl.user);

};

angular.module('ROOM')
	.component('roomUser', {
		bindings: {
			user: '<',

			hideKick: '<',
			enableReady: '<',

			onKick: '&?',
			onReady: '&?',
			onColorChange: '&?',
		},
		templateUrl: 'app/rooms/room/room-user/room-user.html',
		controller: componentController
	});
