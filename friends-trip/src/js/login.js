import React from "react";

import app from "./app.js";
import Overlay from "../components/overlay/overlay.jsx";

import { Typography } from "rmwc/Typography";
import { Button, ButtonIcon } from "rmwc/Button";
import { Snackbar } from "rmwc/Snackbar";
import { TextField } from "rmwc/TextField";
import { LinearProgress } from "rmwc/LinearProgress";
import { Elevation } from "rmwc/Elevation";

import "../styles/app.less";

export default class Login extends React.Component {
  state = {
    isLoading: false,
    isError: false,
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
      errorModel,
      isError: true
    });

    setTimeout(
      () => this.setState({ errorModel: false, isError: false }),
      1500
    );
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
    const { errorModel, isError, isLoading } = this.state;

    const errorMessage = (errorModel && errorModel.message) || "kakoy-to bag";

    return (
      <div>
        <Overlay>
          <Elevation z="2" className="fl-col">
            <div className="fl-col controls">
              <Typography use="headline5" className="login-splash">
                ✈️ Friends Trip
              </Typography>
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
            </div>

            <div className="fl-row controls">
              <Button type="button" onClick={this.register}>
                <ButtonIcon use="fiber_new" />
                Register
              </Button>
              <Button raised type="submit" onClick={this.signin}>
                <ButtonIcon use="fingerprint" />
                Login
              </Button>
            </div>
            <LinearProgress determinate={!isLoading} />
          </Elevation>
        </Overlay>

        <Snackbar
          show={this.state.isError}
          message={<div>⛔{errorModel.message || "kakoy-to bag"}</div>}
          alignStart
        />
      </div>
    );
  }
}
