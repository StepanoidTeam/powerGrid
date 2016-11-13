angular.module('app')
.service('tokenService', function ($cookies) {
	var svc = this;

	var tokenCookieKey = 'AuthToken';

	svc.getToken = function () {
		return $cookies.getObject(tokenCookieKey);
	};

	svc.mapToken = function (rawToken) {
		return rawToken[tokenCookieKey];
	};

	svc.saveToken = function (token) {
		$cookies.putObject(tokenCookieKey, token);
	};

	svc.deleteToken = function () {
		$cookies.remove(tokenCookieKey);
	};
});