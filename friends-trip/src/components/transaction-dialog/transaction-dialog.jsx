import React from "react";
import _uniqBy from "lodash/uniqBy";

import { moneyRound } from "../../js/web";
import Dialog from "../dialog/dialog";

import "./transaction-dialog.less";

import InputProgress from "../input-progress/input-progress";

export const DialogTypes = { NEW: "NEW", EDIT: "EDIT" };

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
      <Dialog isOpen={isOpen} className="transaction-dialog fl-col">
        <label className="details-form-field fl-col">
          Description:
          <input
            type="text"
            defaultValue={item.description}
            onChange={event => this.descriptionChanged(event.target.value)}
          />
        </label>

        <div className="details-form-field fl-row">
          <label>
            Total
            <input
              type="number"
              min="0"
              max="100000"
              value={item.fullAmount}
              onChange={event => this.totalChanged(+event.target.value)}
            />
          </label>
          <label className="fl-row fl-center">
            ⚖️
            <input
              type="checkbox"
              checked={splitEqually}
              onChange={event => this.splitEquallyChecked(event.target.checked)}
            />
            eq.Split
          </label>
        </div>

        <div className="details-form-field">
          <label>Users:</label>
        </div>

        {this.renderDebtors(item)}

        <div className="fl-row controls">
          <button onClick={() => onClose(this.state.item)}>✅ Save</button>
          <button onClick={() => onClose()}>✖️ Cancel</button>
        </div>
      </Dialog>
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
          <label className="details-form-field fl-row fl-center" key={key}>
            <input
              type="checkbox"
              checked={hasValue}
              onChange={event =>
                this.debtorActiveChanged(debtor, event.target.checked)
              }
            />

            {debtor.userName}
            <InputProgress
              value={debtor.amount}
              max={item.fullAmount}
              onChange={event =>
                this.onDebtorAmountChanged(debtor, +event.target.value)
              }
            />
          </label>
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
