import React from "react";
import _uniqBy from "lodash/uniqBy";

import { moneyRound } from "../../js/web";

import "./transaction-dialog.less";

import InputProgress from "../input-progress/input-progress";

import { SimpleDialog } from "rmwc/Dialog";

import { Typography } from "rmwc/Typography";

import { Button, ButtonIcon } from "rmwc/Button";

export const DialogTypes = { NEW: "NEW", EDIT: "EDIT" };
import { Checkbox } from "rmwc/Checkbox";
import { Switch } from "rmwc/Switch";
import { TextField } from "rmwc/TextField";
import Overlay from "../overlay/overlay";
import { Elevation } from "../../../node_modules/rmwc";

export default class TransactionDialog extends React.Component {
  state = { splitEqually: true, item: null };

  componentWillReceiveProps(props) {
    const { users, creditor, item, isOpen, type } = props;

    if (!isOpen) return;

    if (type === DialogTypes.NEW) {
      const newItem = {
        creditorName: creditor.Name,
        creditorId: creditor.Id,
        fullAmount: 0,
        description: "",

        debtors: users.map(user => ({
          userId: user.Id,
          userName: user.Name,
          amount: 0
        }))
      };

      this.setState({
        splitEqually: true,
        item: newItem
      });
    } else if (type === DialogTypes.EDIT) {
      //restore missing debtors - for old transactions only
      const zeroDebtors = users.map(user => ({
        userId: user.Id,
        userName: user.Name,
        amount: 0
      }));

      this.setState({
        splitEqually: false,
        item: {
          ...item,
          debtors: _uniqBy([...item.debtors, ...zeroDebtors], "userName")
        }
      });
    }
  }

  render() {
    const { isOpen, type, onClose } = this.props;
    const { item, splitEqually } = this.state;

    if (!isOpen || !item) return null;

    return (
      <Overlay isOpen={isOpen}>
        <Elevation
          z="2"
          className="fl-col"
          style={{ backgroundColor: "white" }}
        >
          <div className="fl-col controls">
            <Typography use="headline5" className="login-splash">
              Transaction
            </Typography>

            <TextField
              outlined
              label="Description"
              value={item.description}
              onChange={event => this.descriptionChanged(event.target.value)}
            />

            <div className="fl-row">
              <TextField
                outlined
                label="Total"
                value={item.fullAmount}
                onChange={event => this.totalChanged(+event.target.value)}
                type="number"
                min="0"
                max="100000"
              />

              <label className="fl-row fl-center">
                ⚖️eq.Split
                <Switch
                  checked={splitEqually}
                  onChange={event =>
                    this.splitEquallyChecked(event.target.checked)
                  }
                />
              </label>
            </div>

            <div>
              <label>Users:</label>
              {this.renderDebtors(item)}
            </div>

            <div className="fl-row controls">
              <Button type="button" onClick={() => onClose()}>
                <ButtonIcon use="clear" />
                Cancel
              </Button>
              <Button
                raised
                type="submit"
                onClick={() => onClose(this.state.item)}
              >
                <ButtonIcon use="save" />
                Save
              </Button>
            </div>
          </div>
        </Elevation>
      </Overlay>
    );
  }

  //todo: validate diag form
  // $("#detailsForm").validate({
  //   rules: {
  //     //description: "required",
  //     fullAmount: { required: true }
  //   },
  //   messages: {
  //     // name: "Please enter name",
  //     fullAmount: "Please enter valid amount"
  //   },
  //   submitHandler: function(event) {
  //     formSubmitHandler(event);
  //   }
  // });

  renderDebtors(item) {
    return item.debtors
      .sort((d1, d2) => d1.userName > d2.userName)
      .map((debtor, key) => {
        const hasValue = debtor.amount !== 0;

        return (
          <div className="fl-row fl-center" key={key}>
            <Checkbox
              checked={hasValue}
              onChange={event =>
                this.debtorActiveChanged(debtor, event.target.checked)
              }
            />

            <InputProgress
              label={`${debtor.userName}'s debt`}
              value={debtor.amount}
              max={item.fullAmount}
              onChange={event =>
                this.onDebtorAmountChanged(debtor, +event.target.value)
              }
            />
          </div>
        );
      });
  }

  descriptionChanged(value) {
    this.setState({
      item: {
        ...this.state.item,
        description: value
      }
    });
  }

  totalChanged(value) {
    if (!isFinite(value)) return;

    this.setState(
      {
        item: {
          ...this.state.item,
          fullAmount: value
        }
      },
      () => {
        if (this.state.splitEqually) {
          this.splitEqually();
        }
      }
    );
  }

  splitEquallyChecked(value) {
    this.setState({ splitEqually: value });

    if (value) {
      this.splitEqually();
    }
  }

  //for all
  splitEqually() {
    const { item } = this.state;

    const selected = item.debtors.filter(debtor => debtor.amount > 0);

    selected.forEach(debtor => {
      debtor.amount = moneyRound(item.fullAmount / selected.length);
    });

    const totalDebt = selected.length
      ? selected.reduce((sum, debtor) => sum + debtor.amount, 0)
      : 0;

    if (totalDebt > 0 && totalDebt < item.fullAmount) {
      const nickelback = +(item.fullAmount - totalDebt).toFixed(2);

      selected[0].amount += nickelback;
    }

    this.setState({ item });
  }

  debtorActiveChanged(debtor, isActive) {
    const { item } = this.state;

    debtor.amount = isActive ? 1 : 0;

    this.setState({ item }, () => {
      if (this.state.splitEqually) {
        this.splitEqually();
      }
    });
  }

  onDebtorAmountChanged(debtor, value) {
    if (!isFinite(value)) return;

    const { item } = this.state;

    debtor.amount = value;

    this.setState({ item });
  }
}
