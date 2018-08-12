import React from "react";

import "./input-progress.less";

export default class InputProgress extends React.Component {
  render() {
    const { value, max, className, onChange } = this.props;

    return (
      <div className={["input-progress", className].join(" ")}>
        <div
          className="bg"
          style={{
            width: `${(value / max) * 100}%`
          }}
        />
        <input
          type="number"
          min={0}
          max={max}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }
}
