'use strict';

//'routing', 'ngCookies',
angular.module('app', [
	'ngCookies',
	'routing',
	'rooms',
	'auth',
])

.run(function () {
	//init stuff goes here
	console.log('app.js init from ng');


})

.component('app', {
	templateUrl: 'app/app.html',
    controller: function (chatService) {
		const ctrl = this;

        ctrl.chatToggle = chatService.chatToggle;

		ctrl.chatIsOpen = true;
        chatService.isOpen.subscribe(value=> {
        	ctrl.chatIsOpen = value;
        });
    }
});


angular.module('app').config(function ($httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});