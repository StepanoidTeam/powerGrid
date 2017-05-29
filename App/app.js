'use strict';

//'routing', 'ngCookies',
angular.module('app', [
    'ngCookies',
    'routing',
    'rooms',
    'auth',
	'asyncFilter',
	//'game',
])

    .run(function () {
        //init stuff goes here
        //console.log('app.js init from ng');
    })

    .component('app', {
        templateUrl: 'app/app.html',
        controller: function (chatService) {
            const ctrl = this;


            //todo: bad, move closer to chat
            ctrl.toggleChat = chatService.toggleChat;

            ctrl.chatIsOpen = false;
            ctrl.chatIsDisabled = true;

            chatService.isOpen.subscribe(value => {
                ctrl.chatIsOpen = value;
            });

            chatService.isDisabled.subscribe((isDisabled) => {
                ctrl.chatIsDisabled = isDisabled;
            });
        }
    });


angular.module('app').config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});
