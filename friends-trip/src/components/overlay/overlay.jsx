import React from "react";

import "./overlay.less";

export default class Overlay extends React.Component {
  render() {
    const { children, isOpen = true } = this.props;

    return isOpen ? <div className="overlay">{children}</div> : null;
  }
}
