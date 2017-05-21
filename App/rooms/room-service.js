'use strict';

angular.module('rooms', [])
	.service('roomService', function ($q, apiEndpoints, apiWsEndpoints, authService) {
		const svc = this;

		svc.roomUsers = new Rx.BehaviorSubject([]);
		svc.getRoomList = apiEndpoints.getRoomList;

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
					return $q.reject({message: 'no room found', roomId: roomId});
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


		svc.toggleReadyObservable = Rx.Observable.from(apiWsEndpoints.wsMessage).filter(msg => {
			return msg.MessageType === "/api/ROOMS/ToggleReady";
		});


		svc.toggleReadyObservable.map(msg => msg.Users).subscribe(users => {
			//todo: update users
			users.forEach(user => {
				const currentUser = svc.roomUsers.value.find(u => u.Id === user.Id);
				currentUser.ReadyMark = user.ReadyMark;
			});
		});


		svc.onRoomsUpdated = function () {
			//todo: podpisatsa nado
			//apiWsEndpoints
		};

	});
