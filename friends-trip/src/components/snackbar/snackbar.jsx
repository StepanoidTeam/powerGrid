import React from "react";

export default class Snackbar extends React.Component {
  render() {
    const { message, show } = this.props;
    return (
      <div
        className={[
          "mdc-snackbar mdc-snackbar--align-start",
          show && "mdc-snackbar--active"
        ].join(" ")}
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden="true"
      >
        <div className="mdc-snackbar__text">{message}</div>

        {/* <div class="mdc-snackbar__action-wrapper" style="display: none;">
          <button
            class="mdc-snackbar__action-button mdc-button mdc-ripple-upgraded"
            aria-hidden="true"
          />
        </div> */}
      </div>
    );
  }
}
