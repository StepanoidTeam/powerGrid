import React from "react";
import ReactDOM from "react-dom";

import app from "./app.js";
import Dialog from "../components/dialog/dialog.jsx";

import "../styles/app.less";
//todo: make that shit a react component

function signin() {
  app.login(username.value, password.value);
}

function register() {
  app.register(username.value, password.value);
}

const page = (
  <div>
    <div id="app-log" />
    <span id="logs" />
    <Dialog isOpen={true} className="login-form">
      <div className="pd-l-10">
        Username:
        <input type="text" id="username" name="username" />
      </div>
      <div className="pd-l-10">
        Password:
        <input type="password" id="password" name="password" />
      </div>
      <div className="pd-l-10">
        <input
          className="btn-login"
          type="submit"
          value="Login"
          onClick={signin}
        />
        OR
        <input
          className="btn-register"
          type="button"
          value="Register me"
          onClick={register}
        />
      </div>
    </Dialog>
  </div>
);

app.init();

ReactDOM.render(page, document.querySelector("#app"));

module.hot.accept();
