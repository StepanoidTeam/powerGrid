Number.prototype.moneyRound = function () {
    return Math.round(this * 100) / 100
};

const config = {
    //wsUrl: 'ws://localhost:5000',
    wsUrl: 'ws://pg-api.azurewebsites.net/api',
    httpUrl: 'http://pg-api.azurewebsites.net/api/',
    //httpUrl: 'http://localhost:5000/api/',
    title: "Friends Trip v.0.1",
    routes: {
        Login: "login.html",
        Transactions: "index.html",
        Report: "report.html",
    }
};

//function jsonp(url, callback) {
//    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
//    window[callbackName] = function(data) {
//        delete window[callbackName];
//        document.body.removeChild(script);
//        callback(data);
//    };

//    var script = document.createElement('script');
//    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
//    document.body.appendChild(script);
//}

var app = {

    generateUid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    EmptyRoom: {
        Id: "",
        Name: "",
    },

    context:
    {
        CurrentUser: null,
        CurrentRoom: null
    },

    onError: function (data) {
        var logTxt = "Sorryan, kakoyto bag. ";
        var errModel = JSON.parse(data.responseText);
        if (errModel.message)
            logTxt += errModel.message;
        app.log(logTxt);
        console.log(JSON.stringify(data));
    },

    ajax: function (actionUrl, data, method, successCallback, errorCallback) {
        var authKey = app.context.CurrentUser == null ? null : app.context.CurrentUser.AuthToken;
        var ajaxUrl = config.httpUrl + actionUrl;
        app.showLoading(true);
        return $.ajax({
            type: method,
            url: ajaxUrl,
            contentType: 'application/json',
            data: JSON.stringify(data),
            beforeSend: function (request) {
                request.setRequestHeader("authToken", authKey);
            },
            crossDomain: true,
            cache: false,
            success: function (data) {
                if (successCallback)
                    successCallback(data);
            },
            error: function (data) {
                app.onError(data);
            },
            complete: function () {
                app.showLoading(false);
                console.log("ajax completed");
            }
        });
    },


    ajax1: function (actionUrl, data, method, successCallback, errorCallback) {
        var ajaxUrl = config.httpUrl + actionUrl;
        app.showLoading(true);
        method = method || "POST";
        var xhr = new XMLHttpRequest();
        xhr.open(method, config.httpUrl + actionUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            document.getElementById("logs").innerText = "test4";
            app.showLoading(false);
            if (xhr.status === 200) {

                document.getElementById("logs").innerText = "test5";
                if (successCallback)
                    successCallback(JSON.parse(xhr.responseText));
            }
            else {
                document.getElementById("logs").innerText = "test6";
                if (errorCallback)
                    errorCallback(xhr);
                else
                    app.onError(xhr);
            }
        };
        xhr.send(JSON.stringify(data));
    },

    showLoading: function (show) {
        var loading = document.getElementById("loading");
        if (show)
            loading.style.display = "block";
        else
            loading.style.display = "none";
    },

    getFromLocalStorage: function (key) {
        var data = JSON.parse(window.localStorage.getItem(key));
        if (!data)
            return null;
        return data;
    },

    log: function (text) {
        var logBox = document.getElementById("app-log");
        logBox.innerText = text;
        logBox.style.display = "block";
        var logId = app.generateUid();
        logBox.logId = logId;
        setTimeout(function () {
            if (logId == logBox.logId) {
                logBox.innerText = "";
                logBox.style.display = "none";
            }
        }, 4000);
    },

    logout: function () {
        window.localStorage.setItem('current-user', null);
        app.checkAuth(null);
    },

    init: function () {
        document.title = config.title;
        app.initContext();
        app.checkAuth(app.context.CurrentUser);

        //add logs component
        $('body').prepend('<div id="app-log" style="position:absolute;width:100%;height:10%;z-index:100;color:red;background-color: gainsboro;display:none;"></div>');
		
		//add global loading component
        var loading = document.createElement('div');
        document.body.insertBefore(loading, document.body.firstChild);
        loading.setAttribute('id', 'loading');
        loading.setAttribute('style', 'display:none;position:absolute;width:100%;height:100%;opacity:0.3;z-index:1000;background:#000;');

    },

    checkAuth: function (user) {
        var curPage = location.pathname.toLowerCase();
        curPage = curPage.substring(curPage.lastIndexOf("/") + 1);
        //document.getElementById("logs").innerText = "["+curPage+"]";
        if (user && curPage == config.routes.Login)
            location.href = config.routes.Transactions;
        else if (!user && curPage != config.routes.Login)
            location.href = config.routes.Login;
    },

    initContext: function ()
    {
        var user = app.getFromLocalStorage('current-user');
        app.context.CurrentUser = user;
        var room = app.getFromLocalStorage('current-room');
        if (room == null)
            app.context.CurrentRoom = app.EmptyRoom;
        else
            app.context.CurrentRoom = room;
    },

    onLoginDone: function (data) {
        var user = data.data;

        window.localStorage.setItem('current-user', JSON.stringify(user));
        app.checkAuth(user);
        //location.href = config.routes.Transactions;
    },

    onGetRoomDone: function (data) {
        var room = data.data;
        window.localStorage.setItem('current-room', JSON.stringify(room)); 
    },

    login: function (username, password) {
        app.ajax('auth/login', { username: username, password: password }, 'POST', app.onLoginDone);
    },

    register: function (username, password) {
        app.ajax('auth/register', { username: username, password: password }, 'POST', app.onLoginDone);
    },

	loadCurrentRoom: function (callback)
    {
        return app.ajax('room/status', {}, 'POST',
            function (result) {
                app.onGetRoomDone(result);
                callback(result);
            });
    }
}

$(function () {
    app.init();
    if (onPageLoaded)
        onPageLoaded();
});