import React from "react";
import ReactDOM from "react-dom";

import * as JQuery from "jquery";

import "./styles/app.less";

import * as login from "./js/login";

const title = "My Minimal React Webpack Babel Setup";

ReactDOM.render(<div>{title}</div>, document.getElementById("app"));

module.hot.accept();
