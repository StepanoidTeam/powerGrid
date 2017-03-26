angular.module('app')
	.service('gameService', function (apiEndpoints) {
		const svc = this;

		svc.getMaps = apiEndpoints.getGameMaps;


		svc.getMap = function (mapId) {
			return apiEndpoints.getGameMapById(mapId);
		};


		//mock
		svc.getCities = function () {
			return Promise.resolve([{"Name": "Kansas City", "RegionKey": "red", "CoordX": 865, "CoordY": 435},
				{"Name": "Oklahoma City", "RegionKey": "red", "CoordX": 810, "CoordY": 550},
				{"Name": "Memphis", "RegionKey": "red", "CoordX": 1000, "CoordY": 560},
				{"Name": "Birmincham", "RegionKey": "red", "CoordX": 1085, "CoordY": 620},
				{"Name": "New Orleans", "RegionKey": "red", "CoordX": 1000, "CoordY": 740},
				{"Name": "Dallas", "RegionKey": "red", "CoordX": 830, "CoordY": 645},
				{"Name": "Houston", "RegionKey": "red", "CoordX": 845, "CoordY": 745},

				{"Name": "Santa Fe", "RegionKey": "blue", "CoordX": 555, "CoordY": 555},
				{"Name": "Phoenix", "RegionKey": "blue", "CoordX": 385, "CoordY": 630},
				{"Name": "San Diego", "RegionKey": "blue", "CoordX": 225, "CoordY": 675},
				{"Name": "Los Angeles", "RegionKey": "blue", "CoordX": 160, "CoordY": 600},
				{"Name": "Las Vegas", "RegionKey": "blue", "CoordX": 290, "CoordY": 520},
				{"Name": "Salt Lake City", "RegionKey": "blue", "CoordX": 400, "CoordY": 380},
				{"Name": "San Francisco", "RegionKey": "blue", "CoordX": 60, "CoordY": 465},

				{"Name": "Fargo", "RegionKey": "yellow", "CoordX": 800, "CoordY": 150},
				{"Name": "Minneapolis", "RegionKey": "yellow", "CoordX": 910, "CoordY": 200},
				{"Name": "Ouluth", "RegionKey": "yellow", "CoordX": 925, "CoordY": 120},
				{"Name": "Chicago", "RegionKey": "yellow", "CoordX": 1045, "CoordY": 325},
				{"Name": "St. Louis", "RegionKey": "yellow", "CoordX": 995, "CoordY": 440},
				{"Name": "Cincinnati", "RegionKey": "yellow", "CoordX": 1160, "CoordY": 415},
				{"Name": "Knoxville", "RegionKey": "yellow", "CoordX": 1165, "CoordY": 520},

				{"Name": "Detroit", "RegionKey": "brown", "CoordX": 1170, "CoordY": 295},
				{"Name": "Boston", "RegionKey": "brown", "CoordX": 1530, "CoordY": 270},
				{"Name": "Buffalo", "RegionKey": "brown", "CoordX": 1325, "CoordY": 270},
				{"Name": "New York", "RegionKey": "brown", "CoordX": 1480, "CoordY": 325},
				{"Name": "Pittsburgh", "RegionKey": "brown", "CoordX": 1285, "CoordY": 370},
				{"Name": "Washington", "RegionKey": "brown", "CoordX": 1360, "CoordY": 430},
				{"Name": "Philadelphia", "RegionKey": "brown", "CoordX": 1440, "CoordY": 380},

				{"Name": "Raleigh", "RegionKey": "green", "CoordX": 1340, "CoordY": 540},
				{"Name": "Norfolk", "RegionKey": "green", "CoordX": 1410, "CoordY": 490},
				{"Name": "Savannah", "RegionKey": "green", "CoordX": 1270, "CoordY": 640},
				{"Name": "Atlanta", "RegionKey": "green", "CoordX": 1175, "CoordY": 615},
				{"Name": "Tampa", "RegionKey": "green", "CoordX": 1215, "CoordY": 815},
				{"Name": "Miami", "RegionKey": "green", "CoordX": 1310, "CoordY": 890},
				{"Name": "Jacksonville", "RegionKey": "green", "CoordX": 1270, "CoordY": 720},

				{"Name": "Omaha", "RegionKey": "violet", "CoordX": 835, "CoordY": 340},
				{"Name": "Cheyenne", "RegionKey": "violet", "CoordX": 600, "CoordY": 320},
				{"Name": "Denver", "RegionKey": "violet", "CoordX": 585, "CoordY": 400},
				{"Name": "Billings", "RegionKey": "violet", "CoordX": 510, "CoordY": 180},
				{"Name": "Boise", "RegionKey": "violet", "CoordX": 270, "CoordY": 245},
				{"Name": "Seattle", "RegionKey": "violet", "CoordX": 105, "CoordY": 70},
				{"Name": "Portland", "RegionKey": "violet", "CoordX": 60, "CoordY": 160}]);
		};

		svc.getRegions = function () {
			return Promise.resolve([
				{"Name": "Los Angeles", "RegionKey": "blue", "CoordX": 160, "CoordY": 600},
				{"Name": "Las Vegas", "RegionKey": "blue", "CoordX": 290, "CoordY": 520},
				{"Name": "Salt Lake City", "RegionKey": "blue", "CoordX": 400, "CoordY": 380},
				{"Name": "San Francisco", "RegionKey": "blue", "CoordX": 60, "CoordY": 465}
			]);
		};

	});