angular.module('rooms', [])
    .component('rooms', {
        template: '<ng-outlet></ng-outlet>',
        $routeConfig: [
            { path: '/list', name: 'RoomList', component: 'roomList', useAsDefault: true },
            { path: '/:id', name: 'Room', component: 'room' },
        ]
    });