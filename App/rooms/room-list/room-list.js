'use strict';

var componentController = function () {
	var ctrl = this;

	this.$routerOnActivate = function (next) {
		//// Load up the heroes for this view
		//heroService.getHeroes().then(function (heroes) {
		//	$ctrl.heroes = heroes;
		//	selectedId = next.params.id;
		//});
		console.log('room',next);
	};
};

angular.module('rooms')
	.component('roomList', {
		bindings: {
			//some login callbacks
		},
		templateUrl: 'app/rooms/room-list/room-list.html',
		controller: componentController
	});