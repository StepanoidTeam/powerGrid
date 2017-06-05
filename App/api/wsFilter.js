'use strict';

angular.module('app')
	.constant('wsFilter', {
		Room: {
			Create: msg => msg.BroadcastReason === '/api/room/create',
			Join: msg => msg.BroadcastReason === '/api/room/join',

			Leave: msg => msg.BroadcastReason === '/api/room/leave',
			Closed: msg => msg.BroadcastReason === '/api/room/roomclosed',

			StartGame: msg => msg.BroadcastReason === '/api/room/startgame',
		},
		Game: {
			ToggleReady: msg => msg.BroadcastReason === 'api/game/toggleready',//todo: no slash from server
			ChangeColor: msg => msg.BroadcastReason === 'api/game/changecolor',//todo: no slash from server
		},
		Auth: {
			Login: msg => msg.BroadcastReason === '/api/auth/login',
			Logout: msg => msg.BroadcastReason === '/api/auth/logout',
			Status: msg => msg.BroadcastReason === '/api/auth/status',
		},
		Channel: {
			Send: msg => msg.BroadcastReason === '/api/channel/send',
		},
	})
;
