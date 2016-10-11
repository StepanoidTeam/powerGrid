'use strict';

angular.module('powerGrid', [])
    .run(function () {
    	//init stuff goes here
    	console.log('app.js init from ng');
    });
    //.config([function ($httpProvider) {
    //    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    //    $httpProvider.defaults.useXDomain = true;
    //    $httpProvider.interceptors.push('XSRFTokenInterceptor');
    //}]);