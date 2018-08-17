import React from "react";

import { Typography } from "rmwc/Typography";
import { Ripple } from "rmwc/Ripple";

import { MARK } from "../../js/web";

import "./grid.less";

const currency = "💶"; //"€";

function getDateObj(utcDate = null) {
  const date = new Date(utcDate);

  const [week, day, month, year] = date.toUTCString().split(/\,*\s/);
  const [hh, mm, ss] = date.toTimeString().split(/[:\s]/);

  return { week, month, day, year, hh, mm, ss };
}

export default class Grid extends React.Component {
  debtorsRenderer(item) {
    return item.debtors
      .filter(debtor => debtor.amount !== 0)
      .map(debtor => `${debtor.userName}: ${debtor.amount}${currency}`)
      .join(", ");
  }

  statusRenderer(item) {
    const status = !item.id ? MARK.NEW : item.isDirty ? MARK.EDIT : MARK.OLD;
    return <span className={`status ${status}`} />;
  }

  timeRenderer(item) {
    const { week, month, day, hh, mm } = getDateObj(item.time);

    return `${week} ${month} ${day} ${hh}:${mm}`;
  }

  render() {
    const { data = [], onItemSelected } = this.props;

    return (
      <div className="grid">
        {data.map((item, key) => (
          <Ripple key={key} onClick={() => onItemSelected(item)}>
            <div className="grid-row fl-row">
              <div className="fl-col">
                <Typography use="caption">{this.timeRenderer(item)}</Typography>
                <Typography use="headline5">
                  {this.statusRenderer(item)}
                  {item.description}
                </Typography>

                <Typography use="caption">
                  {this.debtorsRenderer(item)}
                </Typography>
              </div>

              <div className="fl-col fl-end ml-auto">
                <Typography use="headline5">{`${
                  item.fullAmount
                }${currency}`}</Typography>
                <Typography use="caption">by {item.creditorName}</Typography>
                <span />
              </div>
              <div className="mdc-list-divider" role="separator" />
            </div>
          </Ripple>
        ))}
      </div>
    );
  }
}
