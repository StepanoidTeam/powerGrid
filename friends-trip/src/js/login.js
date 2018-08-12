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
      <div className="fl-end fl-row">
        Username:
        <input type="text" id="username" name="username" />
      </div>
      <div className="fl-end fl-row">
        Password:
        <input type="password" id="password" name="password" />
      </div>
      <div className="fl-row controls">
        <button className="btn-register" type="button" onClick={register}>
          *️⃣ Register
        </button>
        <button className="btn-login" type="submit" onClick={signin}>
          ✅ Login
        </button>
      </div>
    </Dialog>
  </div>
);

app.init();

ReactDOM.render(page, document.querySelector("#app"));

module.hot.accept();
