'use strict';

angular.module('app')
.service('authService', function ($http, $cookies, apiConfig) {
	var svc = this;
	var userCookieKey = 'user';

	svc.logIn = function (username, password) {
		console.log(username, password);


		var url = apiConfig.apiUrl + 'login' + '/' + username;


		//todo: somehow check auth on each request
		//$cookies.getObject(userCookieKey);


		$http.post(url, { username: username }).then(function (data) {
			//ctrl.value = data.data.data;
			console.info('server login ok', data);
			//todo: save cookie

			var userData = { userId: data.data.data };

			$cookies.putObject(userCookieKey, userData);

		}, function (data) {
			//ctrl.value = 'FAILED TO LOGIN';
			console.warn('server responds bad', data);
		});



	};

	svc.logOut = function () {
		$cookies.remove(userCookieKey);
	};

	svc.register = function (username, password) {

	};

});