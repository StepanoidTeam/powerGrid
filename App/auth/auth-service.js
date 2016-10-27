'use strict';

angular.module('auth', [])
.service('authService', function ($q, $http, $cookies, apiConfig) {
	var svc = this;
	var userCookieKey = 'user';

	var _profile = null;

	svc.profile = function () {
		return _profile;
	};

	svc.isAuthorized = function () {
		return _profile != null;
	};

	svc.logIn = function (username, password) {
		console.log(username, password);

		var url = apiConfig.apiUrl + 'login' + '/' + username;

		return $http.post(url, { username: username }).then(function (data) {
			//ctrl.value = data.data.data;
			console.info('server login ok', data);
			//todo: save cookie

			var userData = { userId: data.data.data };

			if (data.data.isSuccess) {
				$cookies.putObject(userCookieKey, userData);
			} else {
				console.warn('server ok but failed', data);
			}
		}, function (data) {
			//ctrl.value = 'FAILED TO LOGIN';
			console.warn('server login failed', data);
		});
	};

	svc.logOut = function () {
		_profile = null;
		$cookies.remove(userCookieKey);


		var url = apiConfig.apiUrl + 'Logout' + '/' + userData.userId;





	};

	svc.register = function (username, password) {

	};


	svc.checkAuth = function () {
		var df = $q.defer();

		if (_profile) {
			//already has profile
			df.resolve(_profile);
		} else {
			//trying to get from cookies and log in
			var userData = $cookies.getObject(userCookieKey);
			if (userData) {

				var url = apiConfig.apiUrl + 'CheckAuthorization' + '/' + userData.userId;

				//check is auth
				$http.post(url, { userId: userData.userId }).then(function (data) {
					if (data.data.isSuccess && data.data.data) {
						//already logged
						df.resolve(userData);
					} else {
						df.reject({ errorMsg: 'bad cookies', obj: userData, error: data });
					}
				});

				svc.logIn(userData.userId).then(
					function (user) {
						df.resolve(user || userData);
					},
					function (error) {
						df.reject({ errorMsg: 'bad cookies', obj: userData, error: error });
						svc.logOut();
					});
			} else {
				df.reject({ errorMsg: 'no cookies found, try to re-log in' });
			}
		}
		return df.promise;
	};

});