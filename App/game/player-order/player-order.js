'use strict';

var componentController = function (gameService) {
	const ctrl = this;
	ctrl.players = [];
	ctrl.currentPlayer = '';

	ctrl.$onInit = function () {
		gameService.getGameStatus().then(status => {
			console.log(status);

			ctrl.currentPlayer = status.PlayerTurn;
			ctrl.players.splice(0);//delete prevs
			ctrl.players.push(...status.PlayersTurnOrder);
		});
	};

	ctrl.nextTurn = function () {
		let nextPlayerIndex = ctrl.players.indexOf(ctrl.currentPlayer) + 1;

		ctrl.currentPlayer = ctrl.players[nextPlayerIndex < ctrl.players.length ? nextPlayerIndex : 0];
	}

};

angular.module('auth')
	.component('playerOrder', {
		bindings: {},
		templateUrl: 'app/game/player-order/player-order.html',
		controller: componentController
	});
