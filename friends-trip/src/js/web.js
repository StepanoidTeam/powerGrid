import React from "react";
import ReactDOM from "react-dom";

import app, { GIT } from "./app.js";
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

// old shit upper ^ ^ ^

const gridLoadData = () => {
  //todo: @vm ESLI error THEN do nothing?
  return app
    .sync({
      //todo: sync old here from LS
      transactions: []
    })
    .then(data => {
      return {
        data: data.pullResult.transactions
      };
    });
};

/// REACT starts from here v v v

export default class Web extends React.Component {
  state = {
    Settings: {
      filterBy: null
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
    this.setState({ isLoading: false });
  }

  componentDidMount() {
    // todo: run all init shit here

    this.checkOnline();

    app.init();
    this.updateStateFromContext();

    this.setState({ isLoading: true });
    app.loadCurrentRoom();

    gridLoadData().then(data => {
      //replace all table content
      GIT.merge(app.context.Table, data.data);

      this.updateStateFromContext();
    });
  }

  componentDidUpdate() {}

  filterBy = userName => {
    app.context.Settings.filterBy = userName;

    this.updateStateFromContext();
  };

  openDialog(type, item) {
    this.setState({ dialog: { isOpen: true, type, item } });
  }

  //todo: get rid of that shit
  getUserIdByName(name) {
    const { CurrentRoom } = this.state;
    return CurrentRoom.Users.find(u => u.Name === name).Id;
  }

  mapItemToTransaction(item) {
    const usersInfo = item.owe.map(user => ({
      UserId: this.getUserIdByName(user.user),
      Amount: user.amount
    }));

    return {
      Id: item.id, //null when new
      Description: item.description,
      Amount: item.fullAmount,
      OweUsers: usersInfo
    };
  }

  saveClient(item) {
    if (
      item.id &&
      !confirm("It's old transaction, are you sure you want to change it?")
    ) {
      return;
    }

    const transaction = this.mapItemToTransaction(item);
    this.syncTransactions([transaction]);
  }

  syncTransactions(transactions) {
    //todo: @vm do not put item on server directly
    // put it into grid/storage
    // then ELSEWHERE try to sync with server, if online === ok

    this.checkOnline();
    app
      .sync({
        transactions,
        //get list
        ...app.context.Settings
        // pageIndex: 0,
        // pageSize: 0
      })

      .then(data => {
        //replace all table content
        GIT.merge(app.context.Table, data.pullResult.transactions);

        this.updateStateFromContext();
      });
  }

  checkOnline() {
    this.setState({ isOnline: navigator.onLine });
  }

  closeDialog(item) {
    console.log("dialog", item);

    if (item) {
      this.saveClient(item);
    }

    this.setState({ dialog: { isOpen: false } });
  }

  render() {
    const context = this.state;

    const { isLoading, dialog, CurrentRoom: room, CurrentUser: user } = context;

    const filterBy = context.Settings.filterBy;

    if (!room || !room.Users || !user) return null;

    const filteredTransactions = filterBy
      ? context.Table.filter(trans => trans.payer === filterBy)
      : context.Table;

    return (
      <div>
        <Overlay isOpen={isLoading}>⏳Loading...</Overlay>

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
                className={filterBy === user.Name ? "selected" : undefined}
                onClick={() => this.filterBy(user.Name)}
              >
                🔍
                {user.Name}
              </li>
            ))}
            {filterBy && <li onClick={() => this.filterBy()}>❌clear</li>}
          </ul>

          <button onClick={() => prompt("your id", user.AuthToken)}>
            👤
            {user.Name}
          </button>

          <button>⬇️ pull</button>
          <button>⬆️ push</button>
          <button>🈲 merge</button>

          <button className="btn-logout" type="button" onClick={logout}>
            ❌
          </button>
        </div>

        <div className="main-block fl-row">
          <Grid
            data={filteredTransactions}
            onItemSelected={item => this.openDialog(DialogTypes.EDIT, item)}
          />
        </div>

        <TransactionDialog
          users={room.Users}
          payer={user.Name}
          isOpen={dialog.isOpen}
          type={dialog.type}
          item={dialog.item}
          onClose={data => this.closeDialog(data)}
        />

        <Dialog isOpen={this.state.error}>{this.state.error}</Dialog>
      </div>
    );
  }
}

ReactDOM.render(<Web />, document.querySelector("#app"));

module.hot.accept();
