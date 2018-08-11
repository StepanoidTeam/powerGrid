import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import app from "./app.js";
import Grid from "../components/grid/grid.jsx";
import Dialog from "../components/dialog/dialog.jsx";

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

function addTransaction(item) {
  //todo: @vm do not put item on server directly
  // put it into grid/storage
  // then ELSEWHERE try to sync with server, if online === ok

  app.ajax("trans/addorupdate", item, "POST", () => gridLoadData());
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

// old shit upper ^ ^ ^

const gridLoadData = ({
  filterByUserId,
  pageIndex = 1,
  pageSize = 10
} = {}) => {
  //filterByUserId = app.context.Settings.FilterByUserId;
  var startIndex = (pageIndex - 1) * pageSize;

  var deferred = $.Deferred();

  //todo: @vm ESLI error THEN do nothing
  app.ajax(
    "trans/list",
    {
      FilterByUserId: filterByUserId,
      PageIndex: pageIndex - 1,
      PageSize: pageSize
    },
    "POST",
    function(response) {
      var result = response.data.data;
      //data: db.clients.slice(startIndex, startIndex + filter.pageSize),
      //  itemsCount: db.clients.length
      //return{
      //data: result.data,
      //itemsCount: result.totalCount
      //};

      console.log(result.data);
      deferred.resolve({
        data: result.data,
        itemsCount: result.totalCount
      });
    }
  );

  return deferred.promise();
};

/// REACT starts from here v v v

const renderRoomUsers = ({ room, selected }, onUserSelected) => {
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

      <div>
        🔍 Filter by User Id:
        {selected && (
          <button onClick={() => onUserSelected("")}>clear❌</button>
        )}
      </div>
      <ul id="room-users">
        {room.Users.map((user, i) => (
          <li
            key={i}
            className={selected === user.Id && "selected"}
            onClick={() => onUserSelected(user.Id)}
          >
            {user.Name}
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
          readOnly={true}
          style={{ width: "600px" }}
        />
      </div>

      <button className="btn-logout" type="button" onClick={logout}>
        👤
        <span>{user.Name}</span>❌
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
    CurrentRoom: null,
    Table: [],
    isOpen: false
  };

  constructor(props) {
    super(props);
  }

  updateStateFromContext() {
    this.setState(app.context);
  }

  componentDidMount() {
    // todo: run all init shit here
    app.init();
    this.updateStateFromContext();

    console.log(app.context);

    app.loadCurrentRoom(() => {
      console.log("load room done");
      this.updateStateFromContext();
    });

    gridLoadData({ filterByUserId: app.context.Settings.filterByUserId }).then(
      data => {
        app.context.Table = data.data;
        this.updateStateFromContext();
      }
    );
  }

  filterBy = userId => {
    app.context.Settings.filterByUserId = userId;
    app.saveSettings();

    this.updateStateFromContext();

    //hz
    var online = navigator.onLine;

    gridLoadData({ filterByUserId: userId }).then(data => {
      app.context.Table = data.data;
      this.updateStateFromContext();
    });
  };

  openDialog(data) {
    this.setState({ isOpen: true });
  }

  closeDialog(data) {
    console.log(data);
    this.setState({ isOpen: false });
  }

  render() {
    const context = this.state;

    return (
      <div>
        <span id="logs" />

        {this.state.isOpen && (
          <Dialog data={{}} onClose={data => this.closeDialog(data)} />
        )}

        {renderHeadBlock(context.CurrentUser)}
        <div className="main-block">
          <div id="transactionGrid">
            <Grid
              data={context.Table}
              onItemSelected={item => this.openDialog("Edit", item)}
            />
          </div>

          <div id="roomInfo">
            <button onClick={() => this.openDialog(" ✳️ Add 💰", {})}>
              ✳️ Add 💰
            </button>

            {renderRoomUsers(
              {
                room: context.CurrentRoom,
                selected: context.Settings.filterByUserId
              },
              this.filterBy
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Web />, document.querySelector("#app"));

module.hot.accept();
