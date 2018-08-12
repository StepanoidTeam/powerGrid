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

export default class Login extends React.Component {
  state = { error: null };

  constructor(props) {
    super(props);

    app.init({ onError: data => this.onError(data) });
  }

  onError(data) {
    var logTxt = "⛔️ ERROR";
    var errModel = JSON.parse(data.responseText);

    this.setState({
      error: `${logTxt} - ${errModel.message || "kakoy-to bag"}`
    });

    setTimeout(() => this.setState({ error: null }), 5000);
  }

  render() {
    return (
      <div>
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

        <Dialog isOpen={this.state.error}>{this.state.error}</Dialog>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.querySelector("#app"));

module.hot.accept();
