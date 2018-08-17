import Store, { clearStore } from "./store";

export class NetworkError extends Error {
  constructor(value) {
    super(value);
  }
}

const config = {
  httpUrl: "//pg-api.azurewebsites.net/api/",
  //httpUrl: 'http://localhost:5000/api/',

  routes: {
    Login: "login.html",
    Transactions: "index.html",
    Report: "report.html"
  }
};

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

  sync(data) {
    return app.ajax("trans/sync", data);
  },

  logout() {
    clearStore(app.context.CurrentUser);

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
