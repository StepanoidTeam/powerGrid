'use strict';

angular.module('ROOM', [])
	.service('roomService', function ($location, apiEndpoints, apiWsEndpoints, authService, gameService) {
		const svc = this;

		svc.roomUsers = new Rx.BehaviorSubject([]);
		svc.getRoomList = apiEndpoints.getRoomList;

		authService.player.subscribe(player => {
			if (player) {
				if (player.GameRoomId !== null) {
					$location.path('/ROOM/' + player.GameRoomId);
				} else {
					$location.path('/ROOM/List');
				}
			} else {
				//todo: handle this another way
				$location.path('/login');
			}
		});

		svc.roomWsEvents = apiWsEndpoints.wsMessage.filter(msg => msg.EntityType === 'GameRoom');

		svc.roomCreated = svc.roomWsEvents.filter(event => event.BroadcastReason === 'api/Room/create')
			.map(event => {
				return {Id: event.Id, Name: event.Name};
			});

		svc.roomRemoved = svc.roomWsEvents.filter(event => event.BroadcastReason === 'api/Room/leave').map(event => {
			return {Id: event.Id};
		});

		svc.roomJoined = svc.roomWsEvents.filter(event => event.BroadcastReason === 'api/Room/join').map(event => {
			return {Id: event.Id};
		});


		svc.wsToggleReady = svc.roomWsEvents
		//todo: uncomment after server fix
			.filter(msg => msg.BroadcastReason === 'api/Room/ToggleReady')
			//.filter(msg => msg.Users !== undefined)//todo: remove hack
			.map(msg => msg.Users);


		//todo: refac?
		svc.wsToggleReady.subscribe(users => {
			users.forEach(user => {
				const currentUser = svc.roomUsers.value.find(u => u.Id === user.Id);
				currentUser.ReadyMark = user.ReadyMark;
			});
		});

		//todo: should be removed from here, to game service, when server migrates and roomUsers moved to GameSvc too
		gameService.gameBoardWsEvents
			.filter(msg => msg.BroadcastReason === 'api/Room/ChangeColor')
			.map(msg => msg.PlayerBoards)
			.subscribe(boards => {

				boards.forEach(board => {
					const currentUser = svc.roomUsers.value.find(u => u.Id === board.Id);
					currentUser.Color = board.Color;
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
