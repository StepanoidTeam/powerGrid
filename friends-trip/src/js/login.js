import React from "react";

import app from "./app.js";
import Dialog from "../components/dialog/dialog.jsx";
import Overlay from "../components/overlay/overlay.jsx";

import { SimpleDialog } from "rmwc/Dialog";
import { Snackbar } from "rmwc/Snackbar";
import { TextField } from "rmwc/TextField";

import "../styles/app.less";

export default class Login extends React.Component {
  state = {
    isLoading: false,
    errorModel: false,
    user: { username: "", password: "" }
  };

  constructor(props) {
    super(props);
  }

  signin = () => {
    this.setState({ isLoading: true });
    app
      .login(this.state.user)
      .catch(this.onError)
      .finally(() => this.setState({ isLoading: false }));
  };

  register = () => {
    this.setState({ isLoading: true });
    app
      .register(this.state.user)
      .catch(this.onError)
      .finally(() => this.setState({ isLoading: false }));
  };

  onError = errorModel => {
    this.setState({
      errorModel
    });

    //setTimeout(() => this.setState({ errorModel: false }), 4000);
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
    const { errorModel = false, isLoading } = this.state;

    return (
      <div>
        <SimpleDialog
          title="Error"
          body={this.state.error}
          open={true}
          onClose={() => onClose()}
          //onAccept={() => onClose(this.state.item)}
          // onCancel={() => onClose()}
        >
          <TextField
            outlined
            label="Username"
            value={this.state.user.username}
            onChange={event => this.onUsernameChange(event.target.value)}
          />

          <TextField
            outlined
            label="Password"
            type="password"
            value={this.state.user.password}
            onChange={event => this.onPasswordChange(event.target.value)}
          />

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
        </SimpleDialog>

        <Overlay isOpen={isLoading}>⏳Loading...</Overlay>

        <Snackbar
          show={errorModel}
          message={<div>⛔{errorModel.message || "kakoy-to bag"}</div>}
          alignStart
        />
      </div>
    );
  }
}
