import React from "react";

import { moneyRound } from "../../js/web";
import Dialog from "../dialog/dialog";

import "./transaction-dialog.less";

import InputProgress from "../input-progress/input-progress";

export const DialogTypes = { NEW: "NEW", EDIT: "EDIT" };

export default class TransactionDialog extends React.Component {
  componentWillReceiveProps(props) {
    const { context, item, isOpen, type } = props;

    if (!isOpen) return;

    const users = context.CurrentRoom.Users;

    if (type === DialogTypes.NEW) {
      item.payer = context.CurrentUser.Name;
      item.fullAmount = 0;
      item.description = "";

      const owe = users.map(user => {
        return {
          user: user.Name,
          amount: 0
        };
      });

      this.setState({
        item: {
          ...item,
          owe
        }
      });
    } else if (type === DialogTypes.EDIT) {
      //{EntityType: "User", Id: "u#23ee7bc3", Name: "Igor"}
      //owe
      // {user: "Bob", amount: 34}

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
  }

  render() {
    const { isOpen, type, onClose } = this.props;

    if (!isOpen) return null;

    const { item } = this.state;

    return (
      <Dialog isOpen={isOpen} className="transaction-dialog fl-col">
        <label className="details-form-field fl-col">
          Description:
          <input
            //contentEditable={true}
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
              value={item.fullAmount}
              onChange={event => this.totalChanged(+event.target.value)}
            />
          </label>
          <label className="fl-row fl-center">
            ⚖️
            <input
              type="checkbox"
              onChange={event => this.splitEquallyChecked(event.target.checked)}
            />
            eq.Split
          </label>
        </div>

        <div className="details-form-field">
          <label>Users:</label>
        </div>

        {this.renderUsers(type, item)}

        <div className="fl-row controls">
          <button onClick={() => onClose(this.state.item)}>✅ Save</button>
          <button onClick={() => onClose()}>✖️ Cancel</button>
        </div>
      </Dialog>
    );
  }

  //shit below --- v v v

  renderUsers(type, item) {
    return item.owe.sort((u1, u2) => u1.user > u2.user).map((user, key) => {
      const hasValue = user.amount !== 0;

      return (
        <label className="details-form-field fl-row fl-center" key={key}>
          <input
            type="checkbox"
            checked={hasValue}
            onChange={event =>
              this.userActiveChanged(user.user, event.target.checked)
            }
          />

          {user.user}
          <InputProgress
            value={user.amount}
            max={item.fullAmount}
            onChange={event =>
              this.onUserAmtChanged(user.user, +event.target.value)
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
  //   },
  //   messages: {
  //     // name: "Please enter name",
  //     fullAmount: "Please enter valid amount"
  //   },
  //   submitHandler: function(event) {
  //     formSubmitHandler(event);
  //   }
  // });
}
