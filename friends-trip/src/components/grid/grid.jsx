import React from "react";

import "./grid.less";
import { MARK } from "../../js/web";

export default class Grid extends React.Component {
  debtorsRenderer = item =>
    item.debtors.map((debtor, key) => (
      <div key={key} className={"pd-b-10"}>
        {debtor.userName} : {debtor.amount}
      </div>
    ));

  /** /
  item = {
    description: "Ddd3",
    fullAmount: 555,
    id: "transact#4c2f749c",
    debtors: [
      {
        amount: 555,
        userId: "u#69f71a1a",
        userName: "Bob"
      }
    ],
    creditorId: "u#69f71a1a",
    creditorName: "Bob",
    time: "15-08-2018 11:14:54",
    version: 636699284948233700
  }; /**/

  statusRenderer = item => {
    return !item.id ? MARK.NEW : item.isDirty ? MARK.EDIT : MARK.OLD;
  };

  fields = [
    { title: "❔", value: this.statusRenderer },
    { title: "Time", value: item => item.time },
    { title: "Description", value: item => item.description },
    { title: "Payer", value: item => item.creditorName },
    { title: "Amount", value: item => item.fullAmount },
    { title: "Debtors", value: this.debtorsRenderer }
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
