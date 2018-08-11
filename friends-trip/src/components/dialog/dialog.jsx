import React from "react";

import "./dialog.less";
import Overlay from "../overlay/overlay";

const cn = (...args) => args.join(" ");

export default class Dialog extends React.Component {
  render() {
    const { isOpen, children, className } = this.props;

    return (
      <Overlay isOpen={isOpen}>
        <form className={cn("dialog", className)}>{children}</form>
      </Overlay>
    );
  }
}
