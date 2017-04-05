'use strict';

var componentController = function ($scope, $location, gameService) {
	const ctrl = this;

	ctrl.$onInit = function () {

		/*gameService.getMaps()
		 .then(maps => maps[0])
		 .then(gameService.getMap)
		 .then(map => {
		 ctrl.cities = map.Cities;
		 console.log(map);

		 });*/

		Promise.all([gameService.getCities(), gameService.getRegions(), gameService.getConnectors()]).then(results => {
			ctrl.cities = results[0];
			ctrl.regions = results[1];
			ctrl.connectors = results[2];
			$scope.$applyAsync();
		});
	};


	ctrl.getCityCoords = function (cityId) {
		return ctrl.cities.find(x => x.Id === cityId);
	};

	ctrl.getCostCoords = function (connector) {
		const x = (ctrl.getCityCoords(connector.City1Key).CoordX + ctrl.getCityCoords(connector.City2Key).CoordX) / 2;
		const y = (ctrl.getCityCoords(connector.City1Key).CoordY + ctrl.getCityCoords(connector.City2Key).CoordY) / 2;

		return {CoordX: x, CoordY: y};
	};

};

angular.module('app')
	.component('game', {
		bindings: {},
		templateUrl: 'app/game/game.html',
		controller: componentController
	});
