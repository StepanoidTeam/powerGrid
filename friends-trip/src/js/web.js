import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import app from "./app.js";
import Grid from "./grid.jsx";

import "../styles/app.less";

function moneyRound(value) {
  return Math.round(value * 100) / 100;
}

function logout() {
  if (
    confirm(
      "You will not be able log in back if you will not have an Internet, are you want to log out anyway?"
    )
  ) {
    app.logout();
    //location.href = config.routes.Login;
  }
  return;
  false;
}

function refreshGrid() {
  var online = navigator.onLine;

  grid.loadData();
}

function addTransaction(item) {
  //todo: @vm do not put item on server directly
  // put it into grid/storage
  // then ELSEWHERE try to sync with server, if online === ok
  app.ajax("trans/addorupdate", item, "POST", refreshGrid);
  return false;
}

//document.forms.transaction.onsubmit = function () {
//    ajax('transaction/save', { AuthToken: CurrentUser().AuthToken }, 'POST', onSaved, onError);
//    return false;
//};

function getCheckedUsers() {
  var users = [];
  $("#add-transaction-users input[type='checkbox']")
    .filter(":checked")
    .each(function(ind, el) {
      var inp = $(el)
        .closest("div")
        .find('input[type="number"]');
      users.push(inp);
    });
  return users;
}

function onPageLoaded() {
  //jsgrid basic setup was here
  $("#pager").on("change", function() {
    var page = parseInt($(this).val(), 10);

    ReactDOM.render(
      Grid("loadData"),
      document.getElementById("transactionGrid")
    );
    $("#transactionGrid").jsGrid("openPage", page);
  });

  //init dialog
  $("#detailsDialog").addClass("open");
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

  var formSubmitHandler = $.noop;
}

function formSubmitHandler(event) {
  saveClient(client, dialogType === "Add");
  event.preventDefault();
  return false;
}

function saveClient(item, isNew) {
  if (
    $("#transactionId").val() != "" &&
    !confirm("It's old trnsaction, are you sure you want to change it?")
  ) {
    return false;
  }

  var usersInfo = [];
  $.each(getCheckedUsers(), function(ind, el) {
    var amt = moneyRound(parseFloat($(el).val()));
    if (isNaN(amt)) amt = 0;
    usersInfo.push({
      UserId: $(el).attr("systemId"),
      Amount: amt
    });
  });
  //save on server
  var item = {
    Id: $("#transactionId").val(),
    Description: $("#description").val(),
    Amount: moneyRound(parseFloat($("#fullAmount").val())),
    IsSplitAmountEqually: $("#splitEqually").is(":checked"),
    IsCurrentUserInSplitListToo: $("#splitOnYou").is(":checked"),
    OweUsers: usersInfo
  };

  //Dt
  //Id

  $("#detailsDialog").removeClass("open");
  //todo: @vm make all calculations on CLIENT then send calc data to SERVER
  addTransaction(item);
  return false;
}

function onFilterByUserIdChanged() {
  app.context.Settings.filterByUserId = $("#filterByUserId").val();
  app.saveSettings();
  refreshGrid();
}

function onUserClick(systemId) {
  $("#filterByUserId")
    .val(systemId)
    .blur();
}

function onUserAmtChanged(item) {
  if ($("#fullAmount").val() == "") {
    $("#fullAmount").val($(item).val());
  }
}

function userActiveChanged(el, userId) {
  var amtInput = $(el)
    .closest("div")
    .find("input[type='number']");
  if ($(el).is(":checked")) amtInput.prop("disabled", false);
  else amtInput.prop("disabled", true);
}

const renderRoomUsers = room => {
  if (!room) return;

  return (
    <div>
      <span>
        Room Id:
        <span name="roomid" id="roomid">
          {room.Id}
        </span>
      </span>

      <span>
        Name:
        <span name="roomname" id="roomname">
          {room.Name}
        </span>
      </span>

      <ul id="room-users">
        {room.Users.map(user => (
          <li onClick={() => onUserClick(user.Id)} systemId={user.Id}>
            {`${user.Name}(${user.Id})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderHeadBlock = user => {
  if (!user) return null;

  return (
    <div className="head-block">
      <div>
        UserId:
        <span name="userid" id="userid">
          {user.Id}
        </span>
        🔑AuthToken:
        <input
          name="authToken"
          id="authToken"
          type="text"
          value={user.AuthToken}
          // disabled="disabled"
          readOnly={true}
          style={{ width: "600px" }}
        />
      </div>

      <button className="btn-logout" type="button" onClick={logout}>
        👤
        <span name="username" id="username">
          {user.Name}
        </span>
        ❌
      </button>
    </div>
  );
};

export default class Web extends React.Component {
  state = {
    Settings: {
      filterByUserId: ""
    },
    CurrentUser: null,
    CurrentRoom: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // todo: run all init shit here
    app.init();
    this.setState(app.context);
    onPageLoaded();

    console.log(app.context);

    app.loadCurrentRoom(() => {
      console.log("load room done");
      this.setState(app.context);
    });
  }

  render() {
    const context = this.state;

    const { CurrentUser = {} } = context;

    return (
      <div>
        <span id="logs" />
        <div id="detailsDialog" />
        {renderHeadBlock(context.CurrentUser)}
        <div className="main-block">
          <div id="transactionGrid">
            <Grid />
          </div>

          <div id="roomInfo">
            <button onClick={() => showDetailsDialog(" ✳️ Add 💰", {})}>
              ✳️ Add 💰
            </button>

            <div>
              <div>🔍 Filter by User Id:</div>
              <input
                id="filterByUserId"
                name="filterByUserId"
                type="text"
                onBlur={onFilterByUserIdChanged}
                value={context.Settings.filterByUserId}
              />
            </div>

            {renderRoomUsers(context.CurrentRoom)}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Web />, document.querySelector("#app"));

module.hot.accept();
