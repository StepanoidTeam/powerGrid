﻿const config = {
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

  init() {
    app.initContext();
    app.checkAuth(app.context.CurrentUser);
  },

  ajax(actionUrl, data = {}, method = "POST") {
    const authKey =
      app.context.CurrentUser == null
        ? null
        : app.context.CurrentUser.AuthToken;

    const ajaxUrl = config.httpUrl + actionUrl;
    const body = JSON.stringify(data);

    return fetch(ajaxUrl, {
      method,
      body,
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
        throw response;
      })
      .catch(response => {
        console.log("fetch err", response);

        //todo: check if actual
        if (response.status === 401) {
          this.logout();
        }

        return response.json().then(errorModel => {
          console.log("errorModel", errorModel);
          throw errorModel;
        });
      })
      .finally(data => {});
  },

  logout() {
    app.LS.set(app.LS.Keys.USER, null);
    app.checkAuth(null);
  },

  checkAuth(user) {
    var curPage = location.pathname.toLowerCase();
    curPage = curPage.substring(curPage.lastIndexOf("/") + 1);

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

  sync(data) {
    return app.ajax("trans/sync", data);
  },

  login(user) {
    return app.ajax("auth/login", user).then(app.onLoginDone);
  },

  register(user) {
    return app.ajax("auth/register", user).then(app.onLoginDone);
  },

  loadCurrentRoom() {
    return app.ajax("room/status").then(result => {
      const room = result.data;
      app.LS.set(app.LS.Keys.ROOM, room);
    });
  }
};

export default app;
