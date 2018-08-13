import React from "react";
import ReactDOM from "react-dom";

import app from "./app.js";
import Dialog from "../components/dialog/dialog.jsx";
import Overlay from "../components/overlay/overlay.jsx";

import "../styles/app.less";

export default class Login extends React.Component {
  state = {
    errorModel: false,
    user: { username: "", password: "" }
  };

  constructor(props) {
    super(props);

    app.init({
      onError: data => this.onError(data),
      onLoading: value => this.setState({ isLoading: value })
    });
  }

  signin = () => {
    app.login(this.state.user).catch(this.onError);
  };

  register = () => {
    app.register(this.state.user).catch(this.onError);
  };

  onError = errorModel => {
    this.setState({
      errorModel
    });

    setTimeout(() => this.setState({ errorModel: false }), 5000);
  };

  onUsernameChange(username) {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        username
      }
    }));
  }

  onPasswordChange(password) {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        password
      }
    }));
  }

  render() {
    const { errorModel = false } = this.state;

    return (
      <div>
        <Overlay isOpen={this.state.isLoading}>⏳Loading...</Overlay>

        <Dialog isOpen={true} className="login-form">
          <div className="fl-end fl-row">
            Username:
            <input
              type="text"
              value={this.state.user.username}
              onChange={event => this.onUsernameChange(event.target.value)}
            />
          </div>
          <div className="fl-end fl-row">
            Password:
            <input
              type="password"
              value={this.state.user.password}
              onChange={event => this.onPasswordChange(event.target.value)}
            />
          </div>
          <div className="fl-row controls">
            <button
              className="btn-register"
              type="button"
              onClick={this.register}
            >
              *️⃣ Register
            </button>
            <button className="btn-login" type="submit" onClick={this.signin}>
              ✅ Login
            </button>
          </div>
        </Dialog>

        <Dialog isOpen={errorModel}>
          ⛔️
          {errorModel.message || "kakoy-to bag"}
        </Dialog>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.querySelector("#app"));

module.hot.accept();
