import React from "react";

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
    isLoading: false,
    //debug
    lastPull: null,
    mergedTrans: []
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

    this.updateStateFromContext();

    this.setState({ isLoading: true });
    app.loadCurrentRoom();

    //on page start
    this.pull()
      .then(data => {
        return data.pullResult.transactions;
      })
      .then(transactions => {
        //replace all table content
        //GIT.merge(app.context.Table, transactions);

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

    //put at 0
    app.context.Table.unshift(item);

    // const transaction = this.mapItemToTransaction(item);
    // this.syncTransactions([transaction]);
  }

  pull = () => {
    return app
      .sync({
        transactions: []
      })
      .then(data => {
        this.setState({ lastPull: data.pullResult });
        //console.log()
        return data;
      });
  };

  push = () => {
    const { Table: head, lastPull: pull } = this.state;

    const pullVer = pull.version;
    const headVer = head[0].version;

    //    if (pullVer < headVer) {
    //can push

    const endIndex = head.findIndex(t => t.version === pullVer);
    const diff = head.slice(0, endIndex);
    console.log("diff by ver.", endIndex, diff);

    //send to server
    const diff2 = head.filter(
      t => t.id === undefined || t.time === undefined || t.version === undefined
    );
    console.log("diff2 no id/ver/time", diff2);

    const transToPush = diff.map(item => this.mapItemToTransaction(item));
    this.syncTransactions(transToPush);

    // }
  };

  merge = () => {
    console.log("MERGE: no impl.");
  };

  override = () => {
    const { Table: head, lastPull: pull } = this.state;

    //const pullVer = pull.version;
    //    const headVer = head[0].version;

    // if (pullVer > headVer) {
    //   //can merge
    console.log("merge: just overrides local with pull/master");
    GIT.merge(head, pull.transactions);

    this.updateStateFromContext();

    // }
  };

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

    const {
      lastPull,
      isLoading,
      dialog,
      CurrentRoom: room,
      CurrentUser: user,
      Table: transactions
    } = context;

    const filterBy = context.Settings.filterBy;

    if (!room || !room.Users || !user || !transactions) return null;

    const filteredTransactions = filterBy
      ? transactions.filter(trans => trans.payer === filterBy)
      : transactions;

    const pullVer = lastPull ? lastPull.version : "no data";
    const headVer = transactions[0] ? transactions[0].version : "no data";

    const compareVerMessage =
      pullVer === headVer
        ? "✅up to date"
        : pullVer > headVer
          ? "🈲need MERGE"
          : pullVer < headVer
            ? "⬆️need PUSH"
            : "no data";

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

          <button className="btn-logout" type="button" onClick={logout}>
            ❌
          </button>
        </div>

        <div
          className="
        fl-row"
        >
          <button onClick={this.pull}>⬇️ pull</button>
          <button onClick={this.push}>⬆️ push</button>
          <button onClick={this.merge}>🈲 merge</button>
          <button onClick={this.override}>🈲 override</button>
        </div>
        <div className="fl-col">
          <span>
            last pull:
            {pullVer}({lastPull && lastPull.transactions.length})
          </span>
          <span>
            HEAD: {headVer}({transactions.length})
          </span>
          <span>{compareVerMessage}</span>
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
