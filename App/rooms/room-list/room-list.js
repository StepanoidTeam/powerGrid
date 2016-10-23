'use strict';

var componentController = function (authService, roomService) {
	var ctrl = this;

	this.$routerOnActivate = function (next) {
		//// Load up the heroes for this view
		//heroService.getHeroes().then(function (heroes) {
		//	$ctrl.heroes = heroes;
		//	selectedId = next.params.id;
		//});
		//console.log('room', next);
	};

	ctrl.rooms = [];

	ctrl.updateRooms = function () {
		roomService.getRoomList().then(function (rooms) {
			ctrl.rooms = rooms;
		});
	};
	
	ctrl.createRoom = function (roomName) {
		roomService.createRoom(roomName + Date.now()).then(function () {
			ctrl.updateRooms();
		});
	};

	
	
	//init
	ctrl.updateRooms();
};

angular.module('rooms')
	.component('roomList', {
		bindings: {
			//some login callbacks
		},
		templateUrl: 'app/rooms/room-list/room-list.html',
		controller: componentController
	});