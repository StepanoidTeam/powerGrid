angular.module('app')
.service('tokenService', function ($cookies) {
	var svc = this;

	var tokenCookieKey = 'authToken';

	svc.getToken = function () {
		return $cookies.getObject(tokenCookieKey);
	};

	svc.saveToken = function (token) {
		$cookies.putObject(tokenCookieKey, token);
	};

	svc.deleteToken = function () {
		$cookies.remove(tokenCookieKey);
	};
});