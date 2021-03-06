﻿import Store, { clearStore } from "./store";
import { fakeReport } from "./fakeReport";

import { version } from "../../package.json";

export class NetworkError extends Error {
  constructor(value) {
    super(value);
    this.message = "Network problems";
  }
}

const config = {
  httpUrl: "//pg-api.azurewebsites.net/api/",
  //httpUrl: 'http://localhost:5000/api/',

  routes: {
    Login: "login.html",
    Transactions: "index.html",
    Report: "report.html"
  },
  version
};

export const currency = "💶"; //"€";

export const GIT = {
  //API
  push() {
    //send new to server
  },

  pull() {
    //get all from server
  },

  merge(oldValues, newValues) {
    //merge local + server

    // total replace for now
    return oldValues.splice(0, oldValues.length + 1, ...newValues);
  }
};

const app = {
  //todo: remove this
  context: {},
  version,

  init({ updateIsLogged }) {
    //todo: remove context prosloyka
    app.context.CurrentUser = new Store(`current-user`, {});
    app.context.CurrentRoom = new Store(`current-room`, {
      Id: "",
      Name: ""
    });
    app.context.Settings = new Store(`current-settings`, {
      filterBy: null
    });

    app.updateIsLogged = updateIsLogged;
    app.updateIsLogged();
    //todo: if empty room - redir to login?
    const prefix = app.context.CurrentRoom.Id;
    app.context.head = new Store(`${prefix}:transactions`, []);
    app.context.report = new Store(`${prefix}:report`, fakeReport);
    app.context.transactionLogs = new Store(`${prefix}:transactionLogs`, {
      logs: [],
      version: 0
    });

    console.log("@@", app.context.head);
  },

  isLogged() {
    return !!app.context.CurrentUser.Id;
  },

  logger(data) {
    console.log("logger", data);
    return data;
  },

  ajax(actionUrl, data = {}, method = "POST") {
    const authKey = app.context.CurrentUser.AuthToken || null;

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
      .then(response => response.data)
      .then(app.logger)
      .catch(error => {
        if (error instanceof TypeError) {
          throw new NetworkError(error);
        }

        //todo: check if actual
        if (error.status === 401) {
          this.logout();
        }

        return error.json().then(errorModel => {
          console.log("errorModel", errorModel);
          throw errorModel;
        });
      });
  },

  onLoginDone(user) {
    Object.assign(app.context.CurrentUser, user);
    //do we need to?
    app.updateIsLogged();
  },

  //auth mapper
  extractUser(response) {
    return response.data;
  },

  getReport() {
    return app
      .ajax("trans/report")
      .then(response => response.data)
      .then(userReports => {
        const currentUserReport = userReports.find(
          urep => urep.user === app.context.CurrentUser.Name
        );

        Object.assign(app.context.report, currentUserReport);
      });
  },

  getLogs(data) {
    return app
      .ajax("trans/getLogs", data)
      .then(response => response.data)
      .then(resp => {
        if (
          !app.context.transactionLogs.version ||
          app.context.transactionLogs.version <= 0
        )
          app.context.transactionLogs.logs = [];

        app.context.transactionLogs.version = resp.version;
        resp.logs.forEach(log => {
          app.context.transactionLogs.logs.push(log);
        });
      });
  },

  sync(data) {
    return app.ajax("trans/sync", data);
  },

  logout() {
    clearStore(app.context.CurrentUser);
    //todo: clear store immediately?
    localStorage.clear();

    app.updateIsLogged();
  },

  login(user) {
    return app.ajax("auth/login", user).then(app.onLoginDone);
  },

  register(user) {
    return app.ajax("auth/register", user).then(app.onLoginDone);
  },

  loadCurrentRoom() {
    //todo: handle offline error
    return app.ajax("room/status").then(room => {
      Object.assign(app.context.CurrentRoom, room);
    });
  }
};

export default app;
