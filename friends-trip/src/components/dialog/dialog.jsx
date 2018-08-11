import React from "react";
import jQuery from "jquery";

import "./dialog.less";

export default class Dialog extends React.Component {
  showDetailsDialog(dialogType, item) {
    $("#transactionId").val(item.id);
    $("#description").val(item.description);
    $("#fullAmount").val(item.fullAmount);
    $("#splitEqually").prop("checked", false);
    $("#splitOnYou").prop("checked", false);

    $("#add-transaction-users").html("");

    for (var userKey in app.context.CurrentRoom.Users) {
      var curUserId = app.context.CurrentUser.Id;
      var user = app.context.CurrentRoom.Users[userKey];

      var checked = curUserId == user.Id ? "" : "checked='checked'";
      var enabled = curUserId == user.Id ? "disabled='disabled'" : "";
      var val = 0;

      if (dialogType == "Edit") {
        var found = jQuery.grep(item.owe, function(n, i) {
          return n.user == user.Name;
        });
        if (found.length == 1) val = found[0].amount;
      }

      $("#add-transaction-users").append(
        "<div><input type='checkbox' " +
          checked +
          " onclick='userActiveChanged(this, \"" +
          user.Id +
          "\");'>" +
          user.Name +
          ": " +
          "<input type='number' " +
          enabled +
          " min='0' id='add-trans-user-" +
          user.Id +
          "' systemId='" +
          user.Id +
          "' onblur='onUserAmtChanged(this);' value='" +
          val +
          "' />" +
          "</div>"
      );
    }

    //.dialog("option", "title", dialogType + " Transaction");
    //.dialog("open");
  }

  saveClient(data) {
    this.props.onClose(data);
  }

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

  render() {
    return (
      <div className="overlay">
        <form class="dialog">
          <input id="transactionId" name="transactionId" type="hidden" />
          <div className="details-form-field">
            <label>
              Amount:
              <input id="fullAmount" name="fullAmount" type="number" min="0" />
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
              />
            </label>
          </div>
          <div className="details-form-field">
            <label>
              Split equally
              <input id="splitEqually" name="splitEqually" type="checkbox" />
            </label>
          </div>
          <div className="details-form-field">
            <label>
              Split on you too?
              <input id="splitOnYou" name="splitOnYou" type="checkbox" />
            </label>
          </div>
          <div className="details-form-field">
            <label>Users:</label>
            <div id="add-transaction-users" />
          </div>
          <div className="details-form-field">
            <button type="button" id="save" onClick={() => this.saveClient()}>
              ✅ Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}
