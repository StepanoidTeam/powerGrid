import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import app from "./app.js";
import Grid from "../components/grid/grid.jsx";
import TransactionDialog, {
  DialogTypes
} from "../components/transaction-dialog/transaction-dialog.jsx";

import "../styles/app.less";

export function moneyRound(value) {
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

function formSubmitHandler(event) {
  saveClient(client, dialogType === "Add");
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
    //IsSplitAmountEqually: $("#splitEqually").is(":checked"),
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
    <div className="fl-row fl-center">
      <div>🔍 Filter by </div>
      <ul className="room-users fl-row">
        {room.Users.map((user, i) => (
          <li
            key={i}
            className={selected === user.Id ? "selected" : undefined}
            onClick={() => onUserSelected(user.Id)}
          >
            {user.Name}
          </li>
        ))}
        {selected && <li onClick={() => onUserSelected("")}>❌clear</li>}
      </ul>
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
    dialog: { isOpen: false }
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

  openDialog(type, item) {
    this.setState({ dialog: { isOpen: true, type, item } });
  }

  closeDialog(data) {
    console.log(data);
    this.setState({ dialog: { isOpen: false } });
  }

  render() {
    const context = this.state;

    const { dialog, CurrentRoom: room, CurrentUser: user } = context;

    if (!room || !user) return null;

    return (
      <div>
        <div id="app-log" />
        <span id="logs" />

        <TransactionDialog
          isOpen={dialog.isOpen}
          type={dialog.type}
          item={dialog.item}
          context={context}
          onClose={data => this.closeDialog(data)}
        />

        <div className="head-block fl-row">
          <span>
            ✈️
            <span name="roomname" id="roomname">
              {room.Name}
            </span>
          </span>

          <button onClick={() => this.openDialog(DialogTypes.NEW, {})}>
            ✳️ Add 💰
          </button>

          {renderRoomUsers(
            {
              room: context.CurrentRoom,
              selected: context.Settings.filterByUserId
            },
            this.filterBy
          )}

          <button className="btn-logout fl-row" type="button" onClick={logout}>
            👤
            <span>{user.Name}</span>❌
          </button>
        </div>

        <div className="main-block fl-row">
          <Grid
            data={context.Table}
            onItemSelected={item => this.openDialog(DialogTypes.EDIT, item)}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Web />, document.querySelector("#app"));

module.hot.accept();
