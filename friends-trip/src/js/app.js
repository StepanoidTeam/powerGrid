import Store, { clearStore } from "./store";

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

  init() {
    //todo: remove context prosloyka
    app.context.CurrentUser = new Store(`current-user`, {});
    app.context.CurrentRoom = new Store(`current-room`, {
      Id: "",
      Name: ""
    });
    app.context.Settings = new Store(`current-settings`, {
      filterByUserId: ""
    });

    app.checkAuth();
    //todo: if empty room - redir to login?
    const prefix = app.context.CurrentRoom.Id;
    app.context.Table = new Store(`${prefix}:transactions`, []);
  },

  isLogged() {
    return !!app.context.CurrentUser.Id;
  },

  logger(data) {
    console.log(data);
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
      });
  },

  checkAuth() {
    var curPage = location.pathname.toLowerCase();
    curPage = curPage.substring(curPage.lastIndexOf("/") + 1);

    //ROUTING
    if (app.isLogged() && curPage === config.routes.Login) {
      location.href = config.routes.Transactions;
    } else if (!app.isLogged() && curPage !== config.routes.Login) {
      location.href = config.routes.Login;
    }
  },

  onLoginDone(user) {
    Object.assign(app.context.CurrentUser, user);
    //do we need to?
    app.checkAuth();
  },

  //sync mapper
  extractPullItems(response) {
    return response.data.pullResult.transactions;
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

    app.checkAuth();
  },

  login(user) {
    return app.ajax("auth/login", user).then(app.onLoginDone);
  },

  register(user) {
    return app.ajax("auth/register", user).then(app.onLoginDone);
  },

  loadCurrentRoom() {
    return app.ajax("room/status").then(room => {
      Object.assign(app.context.CurrentRoom, room);
    });
  }
};

export default app;
