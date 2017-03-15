'use strict';

var componentController = function ($location, versionService) {
    const ctrl = this;

    ctrl.$onInit = function () {
        versionService.getApiVersion().then(function () {
            $location.path('/login');
        }, function () {
            $location.path('/error');
        });
    };
};

angular.module('auth')
    .component('init', {
        bindings: {},
        templateUrl: 'app/misc/init/init.html',
        controller: componentController
    });