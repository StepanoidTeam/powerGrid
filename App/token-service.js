angular.module('app')
.service('tokenService', function ($cookies) {
	const svc = this;

	var tokenCookieKey = 'AuthToken';

	svc.getToken = function () {
		return $cookies.getObject(tokenCookieKey);
	};

	svc.mapToken = function (rawToken) {
		return rawToken[tokenCookieKey];
	};

	svc.saveToken = function (token) {
		$cookies.putObject(tokenCookieKey, token);
		return token;
	};

	svc.deleteToken = function () {
		$cookies.remove(tokenCookieKey);
	};
});
