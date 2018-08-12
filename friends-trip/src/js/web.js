import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import app from "./app.js";
import Grid from "../components/grid/grid.jsx";
import Dialog from "../components/dialog/dialog";
import TransactionDialog, {
  DialogTypes
} from "../components/transaction-dialog/transaction-dialog.jsx";

import "../styles/app.less";
import { isObject } from "util";

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
  }
}

//document.forms.transaction.onsubmit = function () {
//    ajax('transaction/save', { AuthToken: CurrentUser().AuthToken }, 'POST', onSaved, onError);
//    return false;
//};

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

export default class Web extends React.Component {
  state = {
    Settings: {
      filterByUserId: ""
    },
    CurrentUser: null,
    CurrentRoom: null,
    Table: [],
    dialog: { isOpen: false },
    error: null
  };

  onError(data) {
    var logTxt = "⛔️ ERROR";
    var errModel = data.responseJSON
      ? data.responseJSON
      : data.status
        ? { message: `${data.status} - ${data.statusText}` }
        : {};

    this.setState({
      error: `${logTxt} - ${errModel.message || "kakoy-to bag"}`
    });

    setTimeout(() => this.setState({ error: null }), 5000);
  }

  updateStateFromContext() {
    this.setState(app.context);
  }

  componentDidMount() {
    // todo: run all init shit here

    app.init({ onError: data => this.onError(data) });
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

    //code duplicate
    gridLoadData({ filterByUserId: userId }).then(data => {
      app.context.Table = data.data;
      this.updateStateFromContext();
    });
  };

  openDialog(type, item) {
    this.setState({ dialog: { isOpen: true, type, item } });
  }

  saveClient(item) {
    if (
      item.id &&
      !confirm("It's old trnsaction, are you sure you want to change it?")
    ) {
      return;
    }

    const context = this.state;

    const { CurrentRoom: room } = context;

    const getUserIdByName = name => room.Users.find(u => u.Name === name);

    var usersInfo = item.owe.map(user => ({
      UserId: getUserIdByName(user.user).Id,
      Amount: user.amount
    }));

    //save on server
    var trans = {
      Id: item.id, //todo: what todo with null id? when new
      Description: item.description,
      Amount: item.fullAmount,
      OweUsers: usersInfo
    };

    this.addTransaction(trans);
  }

  addTransaction(item) {
    //todo: @vm do not put item on server directly
    // put it into grid/storage
    // then ELSEWHERE try to sync with server, if online === ok

    app.ajax("trans/addorupdate", item, "POST", () => {
      //code duplicate
      gridLoadData({
        filterByUserId: app.context.Settings.filterByUserId
      }).then(data => {
        app.context.Table = data.data;
        this.updateStateFromContext();
      });
    });
    return false;
  }

  closeDialog(data) {
    console.log(data);

    if (data) {
      //todo: do checks?
      this.saveClient(data, !data.id);
    }

    this.setState({ dialog: { isOpen: false } });
  }

  render() {
    const context = this.state;

    const { dialog, CurrentRoom: room, CurrentUser: user } = context;

    const selected = context.Settings.filterByUserId;

    if (!room || !user) return null;

    return (
      <div>
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

          <div className="fl-row fl-center">
            <div>🔍 Filter by </div>
            <ul className="room-users fl-row">
              {room.Users.map((user, i) => (
                <li
                  key={i}
                  className={selected === user.Id ? "selected" : undefined}
                  onClick={() => this.filterBy(user.Id)}
                >
                  {user.Name}
                </li>
              ))}
              {selected && <li onClick={() => this.filterBy("")}>❌clear</li>}
            </ul>
          </div>

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

        <Dialog isOpen={this.state.error}>{this.state.error}</Dialog>
      </div>
    );
  }
}

ReactDOM.render(<Web />, document.querySelector("#app"));

module.hot.accept();
