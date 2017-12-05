'use strict';

var componentController = function (gameService) {
	const ctrl = this;
	ctrl.PlayersTurnOrder = [];
	ctrl.PlayerBoards = [];

	ctrl.currentPlayerId = '';

	function updateArray(arr1, arr2) {
		arr1.splice(0);
		arr1.push(...arr2);
	}

	ctrl.getPlayer = function (playerId) {
		return ctrl.PlayerBoards.find(x => x.Id === playerId);
	};

	ctrl.$onInit = function () {
		//todo: no need this, use socket info
		gameService.getGameStatus().then(status => {
			console.log(status);

			ctrl.currentPlayerId = status.CurrentPlayerTurn;

			updateArray(ctrl.PlayersTurnOrder, status.PlayersTurnOrder);
			updateArray(ctrl.PlayerBoards, status.PlayerBoards);
		});
	};

	ctrl.nextTurn = function () {
		let nextPlayerIndex = ctrl.PlayersTurnOrder.indexOf(ctrl.currentPlayerId) + 1;

		ctrl.currentPlayerId = ctrl.PlayersTurnOrder[nextPlayerIndex < ctrl.PlayersTurnOrder.length ? nextPlayerIndex : 0];
	}

};

angular.module('auth')
	.component('playerOrder', {
		bindings: {},
		templateUrl: 'app/game/player-order/player-order.html',
		controller: componentController
	});
