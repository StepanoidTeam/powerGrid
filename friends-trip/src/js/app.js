import $ from "jquery";

const config = {
  //wsUrl: 'ws://localhost:5000',
  //wsUrl: "ws://pg-api.azurewebsites.net/api",
  httpUrl: "//pg-api.azurewebsites.net/api/",
  //httpUrl: 'http://localhost:5000/api/',

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

  LS: {
    Keys: {
      SETTINGS: "current-settings",
      USER: "current-user",
      ROOM: "current-room"
    },
    get: key => {
      const valueRaw = window.localStorage.getItem(key);
      var value = JSON.parse(valueRaw);
      return value || null;
    },
    set: (key, value) => {
      const valueRaw = JSON.stringify(value);
      window.localStorage.setItem(key, valueRaw);
    }
  },

  init({ onError, onLoading }) {
    this.onError = data => {
      console.log(data);
      onError(data);
    };
    this.onLoading = onLoading;

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

    return fetch(ajaxUrl, {
      method,
      body: JSON.stringify(data),
      headers: {
        authToken: authKey,
        "Content-Type": "application/json"
      },
      mode: "cors",
      cache: "no-cache"
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        //return response.json();
        throw response; // new Error(`Network response was not ok. ${}`);
      })
      .then(data => {
        console.log("fetch", data);
        app.onLoading(false);
        if (successCallback) successCallback(data);
      })
      .catch(data => {
        console.log("fetch err", data);
        // errorCallback(data);
        if (data.status === 401) {
          this.logout();
        }
        app.onError(data);
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

  logout() {
    app.LS.set(app.LS.Keys.USER, null);
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
    var settings = app.LS.get(app.LS.Keys.SETTINGS);
    if (settings != null) app.context.Settings = settings;

    var user = app.LS.get(app.LS.Keys.USER);
    app.context.CurrentUser = user;
    var room = app.LS.get(app.LS.Keys.ROOM);
    if (room == null) app.context.CurrentRoom = app.EmptyRoom;
    else app.context.CurrentRoom = room;
  },

  saveSettings() {
    app.LS.set(app.LS.Keys.SETTINGS, app.context.Settings);
  },

  onLoginDone(data) {
    var user = data.data;

    app.LS.set(app.LS.Keys.USER, user);
    app.checkAuth(user);
    //location.href = config.routes.Transactions;
  },

  onGetRoomDone(data) {
    var room = data.data;
    app.LS.set(app.LS.Keys.ROOM, room);
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
