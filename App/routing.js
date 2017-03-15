angular.module('routing', ['ngRoute'])

    .config(function ($locationProvider) {
        $locationProvider.html5Mode(false);
        //$locationProvider.hashPrefix('!');
    })

    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {redirectTo: '/init'})
            .when('/init', {template: '<init></init>'})
            .when('/login', {template: '<login></login>'})
            .when('/chat', {template: '<chat></chat>'})
            .when('/rooms', {template: '<room-list></room-list>'})
            .when('/rooms/:id', {
                template: '<room room-id="$resolve.roomId"></room>',
                resolve: {
                    roomId: function ($route) {
                        return $route.current.params.id;
                    },
                }
            })
            .when('/404', {templateUrl: 'app/404.html'})
            .when('/error', {templateUrl: 'app/error.html'})
            .otherwise({redirectTo: '/404'});

    });
