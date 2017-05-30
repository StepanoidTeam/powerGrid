angular.module('app')
	.service('gameService', function (apiEndpoints) {
		const svc = this;

		svc.getGameStatus = function () {

			return Promise.resolve({
				"EntityType": "GameBoard",
				"Stage": 1,
				"PlayerTurn": "u#6ed29551",
				"PlayersTurnOrder": [
					"u#6ed29551",
					"u#6ed29552",
					"u#6ed29553",
					"u#6ed29554",
				],
				"Buildings": [
					{
						"userId": "u#6ed29551",
						"cities": []
					}
				],
				"Phase": "BureaucracyPhase"
			});


			let params = {
				"status": true,
				"stage": true,
				"playerTurn": true,
				"playersTurnOrder": true,
				"buildings": true,
				"phase": true
			};

			return apiEndpoints.getGameStatus(params);
		};



		svc.getMaps = apiEndpoints.getGameMaps;

		svc.getMap = function (mapId) {
			return apiEndpoints.getGameMapById(mapId);
		};

		//mock
		svc.getCities = function () {
			return svc.getMap('default').then(map => map.Cities);
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


		svc.getConnectors = function () {
			return fetch('Assets/connectors.json', {method: 'GET'}).then(response => response.json());
		};

	});
