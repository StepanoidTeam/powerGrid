import React from "react";
import ReactDOM from "react-dom";

import Web from "./js/web";
import Login from "./js/login";
import app from "./js/app";

class App extends React.Component {
  state = { isLogged: false };

  constructor(props) {
    super(props);
  }

  updateIsLogged() {
    this.setState({ isLogged: app.isLogged() });
  }

  componentDidMount() {
    app.init({ updateIsLogged: () => this.updateIsLogged() });
  }

  render() {
    return this.state.isLogged ? <Web /> : <Login />;
  }
}

ReactDOM.render(<App />, document.querySelector("#react-app"));

module.hot.accept();
