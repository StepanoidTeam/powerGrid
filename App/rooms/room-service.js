'use strict';

angular.module('rooms', [])
	.service('roomService', function ($location, apiEndpoints, apiWsEndpoints, authService) {
		const svc = this;

		svc.roomUsers = new Rx.BehaviorSubject([]);
		svc.getRoomList = apiEndpoints.getRoomList;

		authService.player.subscribe(player => {
			if (player) {
				if (player.GameRoomId !== null) {
					$location.path('/rooms/' + player.GameRoomId);
				} else {
					$location.path('/rooms');
				}
			} else {
				$location.path('/login');//todo: or login?
			}
		});


		svc.roomWsEvents = apiWsEndpoints.wsMessage.filter(msg => msg.EntityType === 'GameRoom');

		svc.roomCreated = svc.roomWsEvents.filter(event => event.BroadcastReason === '/api/ROOMS/create')
			.map(event => {
				return {Id: event.Id, Name: event.Name};
			});

		svc.roomRemoved = svc.roomWsEvents.filter(event => event.BroadcastReason === '/api/ROOMS/leave').map(event => {
			return {Id: event.Id};
		});

		svc.roomJoined = svc.roomWsEvents.filter(event => event.BroadcastReason === '/api/ROOMS/join').map(event => {
			return {Id: event.Id};
		});

		svc.wsToggleReady = svc.roomWsEvents.filter(msg => msg.BroadcastReason === '/api/ROOMS/ToggleReady').map(msg => msg.Users);

		svc.wsToggleReady.subscribe(users => {
			users.forEach(user => {
				svc.roomUsers.value.find(u => u.Id === user.Id)
					.forEach(u => u.ReadyMark = user.readyMark);
			});
		});

		//todo: client-side API mock
		svc.getRoom = function (roomId) {
			//return apiEndpoints.getRoom(roomId); //todo: nesuwestvuet!!1
			return svc.getRoomList().then(function (rooms) {
				const currentRoom = rooms.find((r) => r['Id'] === roomId);
				if (currentRoom) {
					svc.roomUsers.next(currentRoom.Users);
					return currentRoom;
				}
				else {
					return Promise.reject({message: 'no room found', roomId: roomId});
				}
			});
		};

		svc.createRoom = function (roomName) {
			return apiEndpoints.createRoom({name: roomName});
		};

		svc.joinRoom = function (roomId) {
			return apiEndpoints.joinRoom({roomId: roomId});
		};

		svc.leaveRoom = function () {
			return apiEndpoints.leaveRoom();
		};

		svc.kickUser = function (userId) {
			return apiEndpoints.kickUser({username: userId});
		};

		svc.toggleReady = function (isReady) {
			return apiEndpoints.toggleReadyRoom({state: isReady});
		};


		svc.startGameRoom = apiEndpoints.startGameRoom;



		svc.onRoomsUpdated = function () {
			//todo: podpisatsa nado
			//apiWsEndpoints
		};

	});
