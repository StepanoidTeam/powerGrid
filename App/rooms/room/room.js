'use strict';

var componentController = function ($scope, $controller, $location, roomService, gameService, authService, errorHandler) {
	const ctrl = this;

	ctrl.player = authService.player;

	ctrl.toggleReady = function (IsDone) {
		roomService.toggleReady(IsDone).then(data => {

		});
	};


	ctrl.changeColor = function (user) {
		roomService.changeColor();
	};

	ctrl.addBot = () => roomService.addBot().catch(errorHandler);

	ctrl.kickUser = function (userId) {
		roomService.kickUser(userId)
			.then(() => ctrl.initRoom());
	};


	ctrl.leaveRoom = function () {
		roomService.leaveRoom().then(() => $location.path('/ROOM/List'));
	};


	ctrl.startGame = function () {
		roomService.startGame()
			.then((data) => console.info(data))
			//.then(() => $location.path('/game/'))
			.catch(errorHandler);
	};


	ctrl.users = new Rx.BehaviorSubject([]);

	ctrl.otherUsers = Rx.Observable.combineLatest(
		ctrl.users, ctrl.player,
		(users, player) => users.filter(u => u.Id !== player.Id));

	ctrl.currentUser = Rx.Observable.combineLatest(
		ctrl.users, ctrl.player,
		(users, player) => users.find(u => u.Id === player.Id));


	ctrl.currentUser.subscribe(() => $scope.$applyAsync());


	ctrl.initRoom = function () {

		roomService.getRoom().then(playerBoards => {
			//todo: remove then/catch?
			console.log(playerBoards);
		}).catch(function (error) {
			console.warn(error);
			$location.path('/ROOM/List');
		});

		roomService.wsToggleReady.subscribe(() => $scope.$applyAsync());
		roomService.wsColorChange.subscribe(() => $scope.$applyAsync());

		roomService.roomUsers.subscribe(users => {
			ctrl.users.next(users);
			$scope.$applyAsync();
		});

	};


	ctrl.$onInit = function () {
		ctrl.initRoom();
	}

};

angular.module('ROOM')
	.component('room', {
		templateUrl: 'app/rooms/room/room.html',
		controller: componentController
	});
