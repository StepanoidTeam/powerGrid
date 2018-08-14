import React from "react";
import _remove from "lodash/remove";

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
    console.warn("remove that shit");
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
    this.gitpull().then(() => {
      this.updateStateFromContext();
    });
  }

  componentDidUpdate() {}

  filterBy = userName => {
    app.context.Settings.filterBy = userName;

    this.updateStateFromContext();
  };

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

  gitcommitChange(item) {
    if (
      item.id &&
      !confirm("It's old transaction, are you sure you want to change it?")
    ) {
      return;
    }

    item.isDirty = true;

    if (item.id) {
      //edited
      //todo: replace in store
      _remove(app.context.Table, { id: item.id });
      app.context.Table.unshift(item);
    } else {
      //new
      //adhoc to remove prev edited NEW record
      _remove(app.context.Table, { fakeid: item.fakeid });
      //to deal with next edit for new item
      item.fakeid = +new Date();
      //todo: put in store
      app.context.Table.unshift(item);
    }
  }

  gitpull = () => {
    return app
      .sync({
        transactions: []
      })
      .then(data => {
        this.setState({ lastPull: data.pullResult });
        return data;
      });
  };

  gitmerge(head, pull) {
    const toadd = [];

    pull.forEach(tfresh => {
      const told = head.find(t => t.id === tfresh.id);

      if (!told) {
        //not found - add new
        toadd.push(tfresh);
      } else {
        //found
        if (!told.isDirty) {
          //pure - can be updated
          _remove(head, { id: tfresh.id });
          toadd.push(tfresh);
        } else {
          //modified - merge conflict!
          //todo: something with that
          if (tfresh.version > told.version) {
            //fresher
            console.group("MERGE conflict:");
            console.log("old", told);
            console.log("new", tfresh);
            console.groupEnd();
            //dunno what to do
          } else {
            //samever, modified
            //just keep as is
          }
        }
      }
    });

    //push all new to head
    head.unshift(...toadd);
  }

  gitpush(head) {
    const allDirty = head.filter(t => t.isDirty);

    //remove from LS all changes, send to server,

    _remove(head, t => t.isDirty);
    //debug
    console.group("DIFF:");
    console.log("✳️new", allDirty.filter(t => !t.id));
    console.log("✴️edited", allDirty.filter(t => t.id));
    console.groupEnd();

    const transToPush = allDirty.map(item => this.mapItemToTransaction(item));

    app
      .sync({
        transactions: transToPush
      })
      .then(response => {
        console.log("Push response", response);
        if (response.pushResult.length === 0) {
          console.log("PUSH Success, no Errors");
        } else {
          //todo: then if any errors - put back to LS from response
          console.warn("PUSH conflicts", response.pushResult);
        }
        return response;
      });
  }

  onPullClick = () => {
    this.gitpull();
  };

  onPushClick = () => {
    const { Table: head } = this.state;
    this.checkOnline();

    this.gitpush(head);
  };

  onMergeClick = () => {
    const { Table: head, lastPull: pull } = this.state;

    console.log("MERGE:");
    this.gitmerge(head, pull.transactions);
    this.updateStateFromContext();
  };

  onOverrideClick = () => {
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

  checkOnline() {
    this.setState({ isOnline: navigator.onLine });
  }

  openDialog(type, item) {
    this.setState({ dialog: { isOpen: true, type, item } });
  }

  closeDialog(item) {
    console.log("dialog", item);

    if (item) {
      this.gitcommitChange(item);
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
          <button onClick={this.onPullClick}>⬇️ pull</button>
          <button onClick={this.onPushClick}>⬆️ push</button>
          <button onClick={this.onMergeClick}>🈲 merge</button>
          <button onClick={this.onOverrideClick}>🈲 override</button>
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
