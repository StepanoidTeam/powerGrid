import React from "react";

import "./grid.less";

export default class Grid extends React.Component {
  oweRenderer = item => {
    return item.owe.map((ower, key) => {
      return (
        <div key={key} className={"pd-b-10"}>
          {ower.user} : {ower.amount}
        </div>
      );
    });
  };

  // item = {
  //   description: "test SW",
  //   fullAmount: 20,
  //   id: "transact#82bd0598",
  //   owe: (3)[({}, {})],
  //   payer: "Bob",
  //   time: "14-08-2018 10:20:16",
  //   version: 636698388167781600
  // };

  statusRenderer = item => {
    return !item.id ? "✳️" : item.isDirty ? "✴️" : "⏺";
  };

  fields = [
    { title: "❔", value: this.statusRenderer },
    { title: "Time", value: item => item.time },
    { title: "Description", value: item => item.description },
    { title: "Payer", value: item => item.payer },
    { title: "Amount", value: item => item.fullAmount },
    { title: "Owe", value: this.oweRenderer }
  ];

  render() {
    const { data = [], className, onItemSelected } = this.props;

    return (
      <table className={["grid", className].join(" ")}>
        <thead>
          <tr>
            {this.fields.map((f, key) => (
              <td key={key}>{f.title}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, key) => (
            <tr key={key} onClick={() => onItemSelected(item)}>
              {this.fields.map((f, key2) => (
                <td key={key2}>{f.value(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
