'use strict';

angular.module('app')
    .service('apiEndpoints', function ($q, $http, tokenService, apiConfig) {
        const svc = this;
        //init
        const apiUrl = apiConfig.apiUrl;

        function apiRequest(httpMethod, apiMethod, data) {

            const headers = {authToken: tokenService.getToken()};

            const url = apiUrl + apiMethod;

            return $http({
                method: httpMethod,//'POST',
                url: url,
                data: data || {},
                headers: headers
            }).then(apiResponse, apiResponse);


            //todo: maybe do unauth redirect here?
        }

        function apiResponse(httpResponse) {
            //var isSuccess  = httpResponse.data.isSuccess;
            const isSuccess = httpResponse.status === 200;//ambigous   && httpResponse.data.status === ok

            /*
             All Possible response statuses:

             Ok,
             UnexpectedError,
             Unauthorized,
             NotInRoom,
             NotInGame,
             NotYourTurn,
             NotFound,
             InvalidModel,
             NotAllowed,
             NotAllowActionInThisPhase
             */


            if (isSuccess) {
                return $q.when(httpResponse.data.data);
            } else {
                return $q.reject(httpResponse.data);
            }
        }


        svc.getVersion = function () {
            return apiRequest('GET', 'VERSION');
        };


        /* USER */
        svc.isLoggedSubject = new Rx.Subject();

        svc.login = function (userModel) {
            return apiRequest('POST', 'USER/Login', userModel)
                .then(tokenService.mapToken)
                .then(tokenService.saveToken)
                .then(() => svc.isLoggedSubject.next(true));
        };

        svc.logout = function () {
            return apiRequest('POST', 'USER/logout')
                .then(tokenService.deleteToken)
                .then(() => svc.isLoggedSubject.next(false));
        };

        //GET /api/USER/Status
        svc.getPlayerStatus = function () {
            const params = {
                "gameRoomId": true,
                "readyMark": true,
                "id": true,
                "name": true
            };

            return apiRequest('POST', 'USER/Status', params);
        };


        /* ROOMS */

        //GET /api/Rooms
        svc.getRooms = function () {
            return apiRequest('GET', 'ROOMS');
        };

        //GET /api/Rooms
        //Rooms list
        svc.getRoomList = function (params) {
            return apiRequest('POST', 'ROOMS/list', params);
        };

        //POST /api/Rooms/Create/{name}
        svc.createRoom = function (params) {
            return apiRequest('POST', 'ROOMS/create', params);
        };

        //POST /api/Rooms/List

        //POST /api/Rooms/Join
        //Join player into specific room
        //roomId
        svc.joinRoom = function (params) {
            return apiRequest('POST', 'ROOMS/join', params);
        };

        //POST /api/Rooms/Leave
        //Leave from current room
        svc.leaveRoom = function () {
            return apiRequest('POST', 'ROOMS/leave');
        };

        //POST /api/Rooms/Kick
        //Kick another player from the room if current user have enough permissions
        svc.kickUser = function (params) {
            return apiRequest('POST', 'ROOMS/kick', params);
        };


        //POST /api/Rooms/ToggleReady
        /* { "state": true } */
        //Set if player ready to start or not
        svc.ToggleReadyRoom = function (params) {
            return apiRequest('POST', 'ROOMS/ToggleReady', params);
        };

        //GET /api/Rooms/StartGame
        //Initiate game

        svc.startGameRoom = function () {
            //todo: change to POST on serv and here
            return apiRequest('GET', 'ROOMS/StartGame');
        };


        //GET /api/Chat/Channels
        svc.getChatChannels = function () {
            return apiRequest('GET', 'CHAT/Channels');
        };

        //POST /api/Chat/GetMessages
        svc.getChatMessages = function (channelId) {
            const params = {
                "id": channelId,
                "start": (new Date(new Date() - 1000 * 60 * 60)).toISOString(),
                "end": (new Date()).toISOString()
            };

            return apiRequest('POST', 'CHAT/GetMessages', params);
        };

        window.apiSvc = svc;
    });