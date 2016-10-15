angular.module('auth', [])
	.component('auth', {
		template: '<ng-outlet></ng-outlet>',
		$routeConfig: [
			{ path: '/login', name: 'Login', component: 'login', useAsDefault: true },
		]
	})