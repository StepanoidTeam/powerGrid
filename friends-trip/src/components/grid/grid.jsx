import React from "react";

import "./grid.less";

export default class Grid extends React.Component {
  oweRenderer = value => {
    return value.map((owe, key) => {
      return (
        <div key={key} className={"pd-b-20"}>
          {owe.user} : {owe.amount}
        </div>
      );
    });
  };

  dateRenderer = value => {
    // var localTime = moment
    //   .utc(value)
    //   .local()
    //   .format("ddd DD MMM-YY HH:mm");

    return value;
  };

  fields = [
    {
      name: "time",
      type: "text",
      width: 80,
      title: "Time",
      renderer: this.dateRenderer
    },
    { name: "description", type: "text", width: 100, title: "Description" },
    { name: "payer", type: "text", width: 100, title: "Payer" },
    { name: "fullAmount", type: "number", width: 80, title: "Amount" },

    {
      name: "owe",
      type: "text",
      width: 150,
      title: "Owe",
      renderer: this.oweRenderer
    }
  ];

  render() {
    const { data = [], className, onItemSelected } = this.props;

    return (
      <table className={["grid", className].join(" ")}>
        <thead>
          <tr>
            {this.fields.map((f, key) => (
              <td key={key} style={{ width: `${f.width}px` }}>
                {f.title}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, key) => (
            <tr key={key} onClick={() => onItemSelected(item)}>
              {this.fields.map((f, key2) => (
                <td key={key2}>
                  {f.renderer ? f.renderer(item[f.name]) : item[f.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
