import $ from "jquery";

const config = {
  //wsUrl: 'ws://localhost:5000',
  //wsUrl: "ws://pg-api.azurewebsites.net/api",
  httpUrl: "//pg-api.azurewebsites.net/api/",
  //httpUrl: 'http://localhost:5000/api/',
  title: "Friends Trip v.0.1",
  routes: {
    Login: "login.html",
    Transactions: "index.html",
    Report: "report.html"
  }
};

const app = {
  EmptyRoom: {
    Id: "",
    Name: ""
  },

  context: {
    Settings: {
      filterByUserId: ""
    },
    CurrentUser: null,
    CurrentRoom: null,
    Table: []
  },

  init({ onError, onLoading }) {
    this.onError = data => {
      console.log(data);
      onError(data);
    };
    this.onLoading = onLoading;

    document.title = config.title;
    app.initContext();
    app.checkAuth(app.context.CurrentUser);
  },

  ajax(actionUrl, data, method, successCallback, errorCallback) {
    var authKey =
      app.context.CurrentUser == null
        ? null
        : app.context.CurrentUser.AuthToken;
    var ajaxUrl = config.httpUrl + actionUrl;
    app.onLoading(true);
    return $.ajax({
      type: method,
      url: ajaxUrl,
      contentType: "application/json",
      data: JSON.stringify(data),
      beforeSend: function(request) {
        request.setRequestHeader("authToken", authKey);
      },
      crossDomain: true,
      cache: false,
      success: function(data) {
        if (successCallback) successCallback(data);
      },
      error: data => {
        if (data.status === 401) {
          this.logout();
        }
        app.onError(data);
      },
      complete: function() {
        app.onLoading(false);
        console.log("ajax completed");
      }
    });
  },

  // ajax1(actionUrl, data, method, successCallback, errorCallback) {
  // 	//var ajaxUrl = config.httpUrl + actionUrl;

  // 	method = method || "POST";
  // 	var xhr = new XMLHttpRequest();
  // 	xhr.open(method, config.httpUrl + actionUrl);
  // 	xhr.setRequestHeader("Content-Type", "application/json");
  // 	xhr.onload = function() {
  // 		document.getElementById("logs").innerText = "test4";

  // 		if (xhr.status === 200) {
  // 			document.getElementById("logs").innerText = "test5";
  // 			if (successCallback)
  // 				successCallback(JSON.parse(xhr.responseText));
  // 		} else {
  // 			document.getElementById("logs").innerText = "test6";
  // 			if (errorCallback) errorCallback(xhr);
  // 			else app.onError(xhr);
  // 		}
  // 	};
  // 	xhr.send(JSON.stringify(data));
  // },

  getFromLocalStorage(key) {
    var data = JSON.parse(window.localStorage.getItem(key));
    return data || null;
  },

  logout() {
    window.localStorage.setItem("current-user", null);
    app.checkAuth(null);
  },

  checkAuth(user) {
    var curPage = location.pathname.toLowerCase();
    curPage = curPage.substring(curPage.lastIndexOf("/") + 1);
    //document.getElementById("logs").innerText = "["+curPage+"]";
    if (user && curPage == config.routes.Login)
      location.href = config.routes.Transactions;
    else if (!user && curPage != config.routes.Login)
      location.href = config.routes.Login;
  },

  initContext() {
    var settings = app.getFromLocalStorage("current-settings");
    if (settings != null) app.context.Settings = settings;

    var user = app.getFromLocalStorage("current-user");
    app.context.CurrentUser = user;
    var room = app.getFromLocalStorage("current-room");
    if (room == null) app.context.CurrentRoom = app.EmptyRoom;
    else app.context.CurrentRoom = room;
  },

  saveSettings() {
    window.localStorage.setItem(
      "current-settings",
      JSON.stringify(app.context.Settings)
    );
  },

  onLoginDone(data) {
    var user = data.data;

    window.localStorage.setItem("current-user", JSON.stringify(user));
    app.checkAuth(user);
    //location.href = config.routes.Transactions;
  },

  onGetRoomDone(data) {
    var room = data.data;
    window.localStorage.setItem("current-room", JSON.stringify(room));
  },

  login(username, password) {
    app.ajax(
      "auth/login",
      { username: username, password: password },
      "POST",
      app.onLoginDone
    );
  },

  register(username, password) {
    app.ajax(
      "auth/register",
      { username: username, password: password },
      "POST",
      app.onLoginDone
    );
  },

  loadCurrentRoom(callback) {
    return app.ajax("room/status", {}, "POST", function(result) {
      app.onGetRoomDone(result);
      callback(result);
    });
  }
};

export default app;
