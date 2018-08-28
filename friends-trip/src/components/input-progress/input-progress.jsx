import React from "react";

import { TextField } from "rmwc/TextField";

import "./input-progress.less";

export default class InputProgress extends React.Component {
  render() {
    const { label, value, max, className, onChange } = this.props;

    return (
      <div className={["input-progress", className].join(" ")}>
        <div
          className="bg"
          style={{
            width: `${(value / max) * 100}%`
          }}
        />
        <TextField
          outlined
          inputmode="numeric"
          label={label}
          min={0}
          max={max}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}
