'use strict';

angular.module('app')
	.constant('wsFilter', {

		Type: {
			User: msg => msg.EntityType === 'User',
			ChatMessage: msg => msg.EntityType === 'ChatMessage',
			GameRoom: msg => msg.EntityType === 'GameRoom',
			GameBoard: msg => msg.EntityType === 'GameBoard',
			Action: msg => msg.EntityType === 'ActionResponse',
		},

		//todo: restructure?

		Room: {
			Create: msg => msg.BroadcastReason === '/api/room/create',
			//todo: ha4ek added to handle bots - remove after server refac
			Join: msg => ['/api/room/join', '/api/game/addbot'].includes(msg.BroadcastReason),

			Leave: msg => msg.BroadcastReason === '/api/room/leave',
			Closed: msg => msg.BroadcastReason === '/api/room/roomclosed',
		},
		Game: {
			//todo: ha4ek for inconsistency server API
			Start: msg => ['/api/game/start','startgameaction'].includes(msg.BroadcastReason),
			ToggleReady: msg => msg.BroadcastReason === '/api/game/toggleready',
			ChangeColor: msg => msg.BroadcastReason === '/api/game/changecolor',
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
