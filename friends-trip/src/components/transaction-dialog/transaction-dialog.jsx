import React from "react";

import { moneyRound } from "../../js/web";
import Dialog from "../dialog/dialog";

import "./transaction-dialog.less";
import { isNumber } from "util";

export const DialogTypes = { NEW: "NEW", EDIT: "EDIT" };

export default class TransactionDialog extends React.Component {
  componentWillReceiveProps(props) {
    const { context, item, isOpen } = props;

    if (!isOpen) return;

    //{EntityType: "User", Id: "u#23ee7bc3", Name: "Igor"}
    //owe
    // {user: "Bob", amount: 34}

    const users = context.CurrentRoom.Users;

    const owe = users.map(user => {
      const ower = item.owe.find(u => u.user === user.Name);
      return {
        user: user.Name,
        amount: ower ? ower.amount : 0
      };
    });

    this.setState({
      item: {
        ...item,
        owe
      }
    });
  }

  render() {
    const { isOpen, type, onClose, context } = this.props;

    if (!isOpen) return null;

    const { item } = this.state;

    return (
      <Dialog isOpen={isOpen} className="transaction-dialog">
        <input
          id="transactionId"
          name="transactionId"
          type="hidden"
          value={item.id}
        />
        <div className="details-form-field">
          <label>
            Amount:
            <input
              id="fullAmount"
              name="fullAmount"
              type="number"
              min="0"
              value={item.fullAmount}
              onChange={event => this.totalChanged(+event.target.value)}
            />
          </label>
        </div>
        <div className="details-form-field">
          <label>
            Description:
            <input
              //contentEditable={true}
              id="description"
              name="description"
              type="text"
              defaultValue={item.description}
            />
          </label>
        </div>
        <div className="details-form-field">
          <label>
            <input
              type="checkbox"
              onChange={event => this.splitEquallyChecked(event.target.checked)}
            />
            Split equally
          </label>
        </div>
        <div className="details-form-field">
          <label>
            <input
              id="splitOnYou"
              name="splitOnYou"
              type="checkbox"
              onChange={event => this.splitOnYou(event.target.checked)}
            />
            Split on you too
          </label>
        </div>
        <div className="details-form-field">
          <label>Users:</label>
          <div id="add-transaction-users">
            {this.showDetailsDialog(type, item)}
          </div>
        </div>
        <div className="details-form-field">
          <button
            type="button"
            id="save"
            onClick={() => onClose(this.state.item)}
          >
            ✅ Save
          </button>
          <button type="button" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </Dialog>
    );
  }

  //shit below --- v v v

  showDetailsDialog(type, item) {
    const { context } = this.props;
    const users = context.CurrentRoom.Users;
    const curUserId = context.CurrentUser.Id;

    return users.map((user, key) => {
      const getVal = user => {
        var ower = item.owe.find(u => u.user === user.Name);

        return ower ? ower.amount : 0;
      };

      const value = getVal(user);
      const hasValue = value !== 0;
      const pts = moneyRound(value / item.fullAmount) * 100;

      return (
        <div key={key}>
          <input
            type="checkbox"
            checked={hasValue}
            onChange={event =>
              this.userActiveChanged(user.Name, event.target.checked)
            }
          />
          {user.Name}

          <input
            type="number"
            min="0"
            style={{
              background: `linear-gradient(to right, #00ff1f30 ${pts}%, white 0%)`
            }}
            onChange={event =>
              this.onUserAmtChanged(user.Name, +event.target.value)
            }
            value={value}
          />
        </div>
      );
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
      state => {
        if (this.isEqual) {
          this.splitEqually();
        }
      }
    );
  }

  isEqual = false;

  splitEquallyChecked(value) {
    this.isEqual = value;
    if (value) {
      this.splitEqually();
    }
  }

  //for all
  splitEqually() {
    const { item } = this.state;

    const selected = item.owe.filter(user => user.amount > 0);
    const rest = item.owe.filter(user => user.amount === 0);

    const owe = selected.map(user => ({
      user: user.user,
      amount: moneyRound(item.fullAmount / selected.length)
    }));

    this.setState({
      item: {
        ...this.state.item,
        owe: [...owe, ...rest]
      }
    });
  }

  splitOnYou(value) {}

  userActiveChanged(userName, isActive) {
    const { item } = this.state;

    const selected = item.owe.filter(user => user.user === userName);
    const rest = item.owe.filter(user => user.user !== userName);

    const owe = selected.map(user => ({
      user: user.user,
      amount: user.user === userName ? (isActive ? 1 : 0) : user.amount
    }));

    this.setState(
      {
        item: {
          ...this.state.item,
          owe: [...owe, ...rest]
        }
      },
      state => {
        if (this.isEqual) {
          this.splitEqually();
        }
      }
    );
  }

  onUserAmtChanged(userName, value) {
    if (!isFinite(value)) return;

    const { item } = this.state;

    const ower = item.owe.find(u => u.user === userName);
    const rest = item.owe.filter(u => u.user !== userName);

    ower.amount = value;

    this.setState({
      item: {
        ...this.state.item,
        owe: [ower, ...rest]
      }
    });
  }

  //.dialog("option", "title", dialogType + " Transaction");
  //.dialog("open");

  //todo: validate diag form

  // $("#detailsForm").validate({
  //   rules: {
  //     //description: "required",
  //     fullAmount: { required: true }
  //     //address: { required: true, minlength: 10 },
  //     //country: "required"
  //   },
  //   messages: {
  //     // name: "Please enter name",
  //     fullAmount: "Please enter valid amount"
  //     //address: "Please enter address (more than 10 chars)",
  //     //country: "Please select country"
  //   },
  //   submitHandler: function(event) {
  //     formSubmitHandler(event);
  //   }
  // });
}
