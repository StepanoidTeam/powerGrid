angular.module('app')
	.service('gameService', function (apiEndpoints, apiWsEndpoints, wsFilter) {
		const svc = this;

		svc.gameBoardWsEvents = apiWsEndpoints.wsMessage.filter(wsFilter.Type.GameBoard);

		svc.getGameStatus = function () {
			let params = {
				"stage": true,
				"playerTurn": true,
				"playersTurnOrder": true,
				"buildings": true,
				"phase": true,
				"playerBoards": true,
				//"filterByUserId": "string",
				"playerBoardOptions": {
					"id": true,
					"money": true,
					"name": true,
					"color": true,
					"buildingsQty": true,
					"bestStation": true,
					"isDone": true
				}
			};

			return apiEndpoints.getGameStatus(params);
		};


		svc.wsGameStart = apiWsEndpoints.wsMessage.filter(wsFilter.Game.Start);

		svc.getMaps = apiEndpoints.getGameMaps;

		svc.getMap = function (mapId) {
			return apiEndpoints.getGameMapById(mapId);
		};

		//mock
		svc.getCities = function () {
			return svc.getMap('default').then(map => map.Cities);
		};


		svc.buildCity = function (cityId) {
			console.log('trying to build',cityId);
			return apiEndpoints.buildCity({cityId});
		};


		svc.getRegions = function () {
			//todo: regions will be there
			//return svc.getMap('default').then(map => map.Regions);
			//mock
			return Promise.resolve([
				{"Id": "purple", "Points": "10,10 645,20 685,190 890,290 890,375 515,460 450,300 0,300"},
				{"Id": "teal", "Points": "0,300 450,300 515,460 700,420 665,745 500,700 400,700 220,680 50,470"},
				{"Id": "yellow", "Points": ""},
				{"Id": "brown", "Points": ""},
				{"Id": "red", "Points": ""},
				{"Id": "green", "Points": ""},
				//...
			]);
		};

		svc.getConnectors = () => svc.getMap('default').then(map => map.Connectors);

	});
