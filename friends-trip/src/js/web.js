import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import app from "./app.js";
import Grid from "../components/grid/grid.jsx";
import Dialog from "../components/dialog/dialog";
import TransactionDialog, {
  DialogTypes
} from "../components/transaction-dialog/transaction-dialog.jsx";
import Overlay from "../components/overlay/overlay.jsx";

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
  }
}

//document.forms.transaction.onsubmit = function () {
//    ajax('transaction/save', { AuthToken: CurrentUser().AuthToken }, 'POST', onSaved, onError);
//    return false;
//};

// old shit upper ^ ^ ^

const gridLoadData = ({ filterByUserId } = {}) => {
  //filterByUserId = app.context.Settings.FilterByUserId;

  var deferred = $.Deferred();

  //todo: @vm ESLI error THEN do nothing
  app.ajax(
    "trans/sync",
    {
      //todo: sync old here from LS
      transactions: [],
      FilterByUserId: filterByUserId
    },
    "POST",
    function(response) {
      const { pullResult } = response.data;
      //data: db.clients.slice(startIndex, startIndex + filter.pageSize),
      //  itemsCount: db.clients.length
      //return{
      //data: result.data,
      //itemsCount: result.totalCount
      //};

      console.log(pullResult.data.data);
      deferred.resolve({
        data: pullResult.data.data,
        itemsCount: pullResult.data.totalCount
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
    error: null,
    isOnline: false,
    isLoading: false
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

    this.checkOnline();

    app.init({
      onError: data => this.onError(data),
      onLoading: value => this.setState({ isLoading: value })
    });
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
    this.checkOnline();

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

    this.syncItems([trans]);
  }

  syncItems(transactions) {
    //todo: @vm do not put item on server directly
    // put it into grid/storage
    // then ELSEWHERE try to sync with server, if online === ok

    this.checkOnline();

    app.ajax(
      "trans/sync",
      {
        transactions
        // filterByUserId: "string",
        // pageIndex: 0,
        // pageSize: 0
      },
      "POST",
      data => {
        //code duplicate
        gridLoadData({
          filterByUserId: app.context.Settings.filterByUserId
        }).then(data => {
          app.context.Table = data.data;
          this.updateStateFromContext();
        });

        app.context.Table = data.data;
        this.updateStateFromContext();
      }
    );
    return false;
  }

  checkOnline() {
    this.setState({ isOnline: navigator.onLine });
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
        <Overlay isOpen={context.isLoading}>⏳Loading...</Overlay>

        <span id="logs" />

        <div className="head-block fl-row">
          <span>
            ✈️
            <span name="roomname" id="roomname">
              {room.Name}
            </span>
          </span>

          <span>{context.isOnline ? "🌐 online" : "🌑 offline"}</span>

          <button onClick={() => this.openDialog(DialogTypes.NEW, {})}>
            ✳️ Add 💰
          </button>

          <ul className="room-users fl-row">
            {room.Users.map((user, i) => (
              <li
                key={i}
                className={selected === user.Id ? "selected" : undefined}
                onClick={() => this.filterBy(user.Id)}
              >
                🔍
                {user.Name}
              </li>
            ))}
            {selected && <li onClick={() => this.filterBy()}>❌clear</li>}
          </ul>

          <button
            onClick={() => prompt("your id", context.CurrentUser.AuthToken)}
          >
            👤
            {user.Name}
          </button>
          <button className="btn-logout" type="button" onClick={logout}>
            ❌
          </button>
        </div>

        <div className="main-block fl-row">
          <Grid
            data={context.Table}
            onItemSelected={item => this.openDialog(DialogTypes.EDIT, item)}
          />
        </div>

        <TransactionDialog
          isOpen={dialog.isOpen}
          type={dialog.type}
          item={dialog.item}
          context={context}
          onClose={data => this.closeDialog(data)}
        />

        <Dialog isOpen={this.state.error}>{this.state.error}</Dialog>
      </div>
    );
  }
}

ReactDOM.render(<Web />, document.querySelector("#app"));

module.hot.accept();
