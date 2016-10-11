'use strict';

var componentController = function ($http) {
    var ctrl = this;


    //todo: move to manager/service

     var apiVerUrl= 'http://powergrid-api.azurewebsites.net/api/version';

    // var apiVerUrl = 'http://localhost:5000/api/version';
    //var apiVerUrl= 'http://powergrid-api.azurewebsites.net/api';


    // $http({
    //     method: 'GET',
    //     url: apiVerUrl,
    //     headers: { Accept: 'application/json' }
    // }).then(function (data) {
    //     console.info(data);
    // }, function (data) {
    //     console.warn(data);
    // });


    // var jqxhr = $.ajax(apiVerUrl)
    //     .done(function (data) {
    //         console.log("success", data);
    //     })
    //     .fail(function () {
    //         console.log("error");
    //     });



    $http.get(apiVerUrl).then(function (data) {
        ctrl.value = data.data.data;
        console.info('server responds ok', data);
    }, function (data) {
        ctrl.value = 'FAILED TO LOAD VERSION';
        console.warn('server responds bad', data);
    });


    ctrl.value = 'loading...';
};

angular.module('powerGrid')
    .component('version', {
        bindings: {
        },
        templateUrl: 'app/misc/version/version.html',
        controller: componentController
    });