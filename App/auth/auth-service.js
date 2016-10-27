'use strict';

angular.module('auth', [])
.service('authService', function ($q, $http, $cookies, apiEndpoints, apiConfig) {
	var svc = this;
	var userCookieKey = 'user';

	var _profile = null;

	svc.profile = function () {
		return _profile;
	};

	svc.isAuthorized = function () {
		return _profile != null;
	};

	svc.logIn = function (userId) {
		return apiEndpoints.login(userId).then(function (userId) {
			//store cookie
			return svc.setUserData({ userId: userId });
		}).catch(function (error) {
			//error on login
			return svc.logOut();
		});
	};

	svc.logOut = function () {
		//_profile = null;
		$cookies.remove(userCookieKey);
		return apiEndpoints.logout();
	};

	svc.register = function (username, password) {

	};

	svc.getUserData = function () {
		var userData = $cookies.getObject(userCookieKey);

		return (userData) ?
			$q.when(userData) :
			$q.reject('no user cookies found');
	};

	svc.setUserData = function (userData) {
		$cookies.putObject(userCookieKey, userData);
		return $q.when(true);
	};


	//returns: userId on OK, reject on fail
	svc.checkAuth = function () {
		return svc.getUserData().then(function (userData) {
			//check is isAuthorized
			return apiEndpoints.isAuthorized(userData.userId).then(function (isAuthorized) {
				if (isAuthorized) {
					//already logged
					return $q.when(userData.userId);
				} else {
					//not logged yet
					return svc.logIn(userData.userId);
				}
			}, function (error) {
				//is not authorized
				return svc.logIn(userData.userId);
			});
		});
	};

});