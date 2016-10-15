'use strict';

//'routing', 'ngCookies',
angular.module('app', [
	'ngComponentRouter',
	'heroes',
	//'auth'
])
    .config(function ($locationProvider) {
    	$locationProvider.html5Mode(false);
    })
    .value('$routerRootComponent', 'app')
     .run(function () {
         //init stuff goes here
         console.log('app.js init from ng');
     })
     .config([function ($httpProvider) {
         //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
         //    $httpProvider.defaults.useXDomain = true;
         //    $httpProvider.interceptors.push('XSRFTokenInterceptor');
     }])

    .component('app', {
    	templateUrl:'app/app.html',
       
    	$routeConfig: [
            //{ path: '/crisis-center/...', name: 'CrisisCenter', component: 'crisisCenter', useAsDefault: true },
            { path: '/heroes/...', name: 'Heroes', component: 'heroes' },

    		//{ path: '/auth/...', name: 'Auth', component: 'auth' },
    	//{ path: '/login/...', name: 'Login', component: 'login' },

			  { path: '/login', name: 'Login', component: 'login', useAsDefault: true },
			  //{path: '/:id', name: 'HeroDetail', component: 'heroDetail'}
    	]
    });


angular.module('app').config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);