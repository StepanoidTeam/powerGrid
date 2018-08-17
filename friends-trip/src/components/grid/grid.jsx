import React from "react";

import "./grid.less";
import { MARK } from "../../js/web";

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryText,
  ListItemGraphic,
  ListItemMeta,
  SimpleListItem,
  ListItemRoot
} from "rmwc/List";

import { Ripple } from "rmwc/Ripple";

// export const shitDateToUTC = (shitDate = "") => {
//   const day = shitDate.slice(0, 2);
//   const month = shitDate.slice(3, 5);
//   const year = shitDate.slice(7, 11);
//   const time = shitDate.slice(13, 20);

//   return { day, month, year, time };
// };

function getDateObj(utcDate = null) {
  const date = new Date(utcDate);

  const [week, month, day, year] = date.toUTCString().split(/\,*\s/);
  const [hh, mm, ss] = date.toTimeString().split(/[:\s]/);

  return { week, month, day, year, hh, mm, ss };
}

export default class Grid extends React.Component {
  debtorsRenderer = item =>
    item.debtors.map((debtor, key) => (
      <div key={key} className={"pd-b-10"}>
        {debtor.userName} : {debtor.amount}
      </div>
    ));

  statusRenderer = item => {
    return !item.id ? MARK.NEW : item.isDirty ? MARK.EDIT : MARK.OLD;
  };

  timeRenderer = item => {
    const status = this.statusRenderer(item);

    const { week, month, day, year, hh, mm, ss } = getDateObj(item.time);

    return (
      <div>
        <span className={`status ${status}`} />
        {week}
        <br />
        {`${month} ${day}`}
        <br />
        {`${hh}:${mm}`}
      </div>
    );
  };

  fields = [
    { title: "Time", value: this.timeRenderer },
    { title: "Description", value: item => item.description },
    {
      title: "Payer",
      value: item => `${item.creditorName}:${item.fullAmount}`
    },

    { title: "Debtors", value: this.debtorsRenderer }
  ];

  render() {
    const { data = [], className, onItemSelected } = this.props;

    return (
      // <div className="grid">
      //   <Ripple>
      //     <p>Standard Ripple</p>
      //   </Ripple>

      //   <Ripple>
      //     <p>Standard Ripple</p>
      //   </Ripple>

      //   <Ripple>
      //     <p>Standard Ripple</p>
      //   </Ripple>
      // </div>

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
