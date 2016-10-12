'use strict';

angular.module('app', ['ngComponentRouter', 'routing', 'ngCookies', 'heroes', 'crisis-center'])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .value('$routerRootComponent', 'app')
    // .run(function () {
    //     //init stuff goes here
    //     console.log('app.js init from ng');
    // })
    // .config([function ($httpProvider) {
    //     //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    //     //    $httpProvider.defaults.useXDomain = true;
    //     //    $httpProvider.interceptors.push('XSRFTokenInterceptor');
    // }])
    
    .component('app', {
        template:
        '<nav>\n' +
        '  <a ng-link="[\'CrisisCenter\']">Crisis Center</a>\n' +
        '  <a ng-link="[\'Heroes\']">Heroes</a>\n' +
        '</nav>\n' +
        '<ng-outlet></ng-outlet>\n',
        $routeConfig: [
            { path: '/crisis-center/...', name: 'CrisisCenter', component: 'crisisCenter', useAsDefault: true },
            { path: '/heroes/...', name: 'Heroes', component: 'heroes' }
        ]
    });



angular.module('app').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}]);