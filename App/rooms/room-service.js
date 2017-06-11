'use strict';

angular.module('ROOM', [])
	.service('roomService', function ($location, apiEndpoints, apiWsEndpoints, authService, gameService, wsFilter) {
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

		svc.roomWsEvents = apiWsEndpoints.wsMessage.filter(wsFilter.Type.GameRoom);

		svc.roomCreated = svc.roomWsEvents.filter(wsFilter.Room.Create)
			.map(event => {
				return {Id: event.Id, Name: event.Name};
			});

		svc.roomClosed = svc.roomWsEvents.filter(wsFilter.Room.Closed)
			.map(event => {
				return {Id: event.Id, Name: event.Name};
			});


		svc.roomUsersLeft = svc.roomWsEvents.filter(wsFilter.Room.Leave).map(event => event.Users);
		svc.roomUsersJoined = svc.roomWsEvents.filter(wsFilter.Room.Join).map(event => event.Users);


		svc.roomUsersJoined.subscribe(usersJoined => {
			let usersRemain = svc.roomUsers.value;
			usersRemain.push(...usersJoined);
			svc.roomUsers.next(usersRemain);
		});

		svc.roomUsersLeft.subscribe((usersLeft = []) => {
			//todo: looks shitty
			let usersRemain = svc.roomUsers.value;
			usersLeft.forEach(u => usersRemain.splice(usersRemain.findIndex(x => x.Id === u.Id), 1));
			svc.roomUsers.next(usersRemain);
		});


		svc.gameBoardWsEvents = apiWsEndpoints.wsMessage.filter(wsFilter.Type.GameBoard);
		svc.wsToggleReady = svc.gameBoardWsEvents
			.filter(wsFilter.Game.ToggleReady)
			.map(msg => msg.PlayerBoards);


		//todo: refac?
		svc.wsToggleReady.subscribe(users => {
			users.forEach(user => {
				const currentUser = svc.roomUsers.value.find(u => u.Id === user.Id);
				currentUser.IsDone = user.IsDone;
			});
		});

		//todo: should be removed from here, to game service, when server migrates and roomUsers moved to GameSvc too
		gameService.gameBoardWsEvents
			.filter(wsFilter.Game.ChangeColor)
			.map(msg => msg.PlayerBoards)
			.subscribe(boards => {

				boards.forEach(board => {
					const currentUser = svc.roomUsers.value.find(u => u.Id === board.Id);
					currentUser.Color = board.Color;
				});


			});

		//todo: should be removed, use gamesvc get game status directly
		svc.getRoom = function () {
			return gameService.getGameStatus().then(function (gameStatus) {
				svc.roomUsers.next(gameStatus.PlayerBoards);
				return gameStatus.PlayerBoards;

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

		svc.toggleReady = function (IsDone) {
			return apiEndpoints.toggleReadyRoom({state: IsDone});
		};

		svc.addBot = function () {
			return apiEndpoints.addBot({
				period: 0
			});
		};


		svc.startGame = apiEndpoints.startGame;


		svc.onRoomsUpdated = function () {
			//todo: podpisatsa nado
			//apiWsEndpoints
		};

	})
;
