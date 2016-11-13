'use strict';

angular.module('rooms')
	.controller('isInRoomCheck', function (authService, $location) {
		authService.getPlayerStatus().then(function (player) {
			if (player.GameRoomId) {
				$location.path('/rooms/' + player.GameRoomId);
			}
		});
	});