'use strict';

var componentController = function ($location, gameService) {
	const ctrl = this;


	ctrl.$onInit = function () {

		/*gameService.getMaps()
		 .then(maps => maps[0])
		 .then(gameService.getMap)
		 .then(map => {
		 ctrl.cities = map.Cities;
		 console.log(map);

		 });*/

		gameService.getCities()
			.then(cities => {
				ctrl.cities = cities;
				console.log(cities);
			});


		gameService.getRegions()
			.then(regions => {
				ctrl.regions = regions;
				console.log(regions);
			});

		gameService.getConnectors()
			.then(connectors => {
				ctrl.connectors = connectors;
				console.log(connectors);
			})
	};


	ctrl.getCityCoords = function (cityId) {
		return ctrl.cities && ctrl.cities.find(x => x.Id === cityId);
	}

};

angular.module('app')
	.component('game', {
		bindings: {},
		templateUrl: 'app/game/game.html',
		controller: componentController
	});
