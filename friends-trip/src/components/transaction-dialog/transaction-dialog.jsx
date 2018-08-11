import React from "react";
import jQuery from "jquery";

import Dialog from "../dialog/dialog";

import "./transaction-dialog.less";

export const DialogTypes = { NEW: "NEW", EDIT: "EDIT" };

export default class TransactionDialog extends React.Component {
  save = () => {
    this.props.onClose("some shit");
  };

  cancel = () => {
    this.props.onClose();
  };

  render() {
    const { isOpen, type, item, onClose } = this.props;

    //check type

    //item = { id: "", description: "", fullAmount: 0 };

    if (!isOpen) return null;

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
            />
          </label>
        </div>
        <div className="details-form-field">
          <label>
            Description:
            <input
              id="description"
              name="description"
              type="text"
              style={{ width: "70%" }}
              value={item.description}
            />
          </label>
        </div>
        <div className="details-form-field">
          <label>
            <input id="splitEqually" name="splitEqually" type="checkbox" />
            Split equally
          </label>
        </div>
        <div className="details-form-field">
          <label>
            <input id="splitOnYou" name="splitOnYou" type="checkbox" />
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
            onClick={() => onClose({ some: 123 })}
          >
            ✅ Save
          </button>
          <button type="button" onClick={this.cancel}>
            Cancel
          </button>
        </div>
      </Dialog>
    );
  }

  //shit below --- v v v

  showDetailsDialog(dialogType, item) {
    const { context } = this.props;
    const users = context.CurrentRoom.Users;
    const curUserId = context.CurrentUser.Id;

    return users.map(user => {
      var val = 0;

      if (dialogType == "Edit") {
        var found = jQuery.grep(item.owe, function(n, i) {
          return n.user == user.Name;
        });
        if (found.length == 1) val = found[0].amount;
      }

      return (
        <div>
          <input
            type="checkbox"
            //checked={curUserId === user.Id}
            onClick={() => this.userActiveChanged(this, user.Id)}
          />
          {user.Name}

          <input
            type="number"
            //disabled={curUserId === user.Id}
            min="0"
            id={`add-trans-user-${user.Id}`}
            systemId={user.Id}
            onBlur={() => onUserAmtChanged(this)}
            value={val}
          />
        </div>
      );
    });
  }

  userActiveChanged() {}

  onUserAmtChanged() {}

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
