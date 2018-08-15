import React from "react";
import _remove from "lodash/remove";
import _sortBy from "lodash/sortBy";

import app, { GIT } from "./app.js";
import Grid from "../components/grid/grid.jsx";
import Dialog from "../components/dialog/dialog";
import TransactionDialog, {
  DialogTypes
} from "../components/transaction-dialog/transaction-dialog.jsx";
import Overlay from "../components/overlay/overlay.jsx";

import "../styles/app.less";

export const MARK = {
  EDIT: "🌗",
  NEW: "🌕",
  OLD: "🌑"
};

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

  onError(errorModel) {
    this.showError(`⛔️${errorModel.message || "kakoy-to bag"}`);
  }

  showError(errorData, timeout = 3000) {
    this.setState({
      error: errorData
    });

    setTimeout(() => this.setState({ error: null }), timeout);
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

  offlineError = error => {
    this.showError(`seems offline ${error}`, 1000);
    this.checkOnline();
    return error;
  };

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
      })
      .catch(this.offlineError);
  };

  gitpush(head) {
    //remove from LS all changes, send to server,
    const allDirty = head.filter(t => t.isDirty);
    _remove(head, t => t.isDirty);

    //debug
    console.group("DIFF:");
    console.log(`${MARK.NEW}new`, allDirty.filter(t => !t.id));
    console.log(`${MARK.EDIT}edited`, allDirty.filter(t => t.id));
    console.groupEnd();

    const transToPush = allDirty.map(item => this.mapItemToTransaction(item));

    return app
      .sync({
        transactions: transToPush
      })
      .then(response => {
        if (response.pushResult.length === 0) {
          console.log("PUSH Success, no Errors");
        } else {
          //todo: then if any errors - put back to LS from response
          console.warn("PUSH conflicts", response.pushResult);
        }
        return response;
      })
      .catch(error => {
        //rollback
        head.unshift(...allDirty);
        throw error;
      })
      .catch(this.offlineError);
  }

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
            console.warn("MERGE conflict", "head", told, "pull", tfresh);

            this.showError(
              <div className="fl-col">
                <span>⚠️MERGE conflict:</span>
                <span>HEAD</span>
                <textarea defaultValue={JSON.stringify(told)} />
                <span>pull</span>
                <textarea defaultValue={JSON.stringify(tfresh)} />
              </div>
            );

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
    //sort head - dirty first, then date asc
    const sorted = _sortBy(head.splice(0), [
      "isDirty",
      item => Date.parse(Date(item.time))
    ]);
    head.push(...sorted);
  }

  onPullClick = () => {
    this.checkOnline();
    this.setState({ isLoading: true });
    this.gitpull().finally(() => {
      this.setState({ isLoading: false });
    });
  };

  onPushClick = () => {
    this.checkOnline();
    const { Table: head } = this.state;
    this.setState({ isLoading: true });
    this.gitpush(head).finally(() => {
      this.setState({ isLoading: false });
    });
  };

  onMergeClick = () => {
    const { Table: head, lastPull: pull } = this.state;

    console.log("MERGE:");
    this.gitmerge(head, pull ? pull.transactions : []);
    this.updateStateFromContext();
  };

  onEmptyClick = () => {
    const { Table: head, lastPull: pull } = this.state;
    head.splice(0);
    this.updateStateFromContext();
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
      Table: head
    } = context;

    const filterBy = context.Settings.filterBy;

    if (!room || !room.Users || !user || !head) return null;

    const filteredTransactions = filterBy
      ? head.filter(trans => trans.payer === filterBy)
      : head;

    const pullVer = lastPull ? lastPull.version : "no data";
    const headVer = head[0] ? head[0].version : "no data";
    const headIsDirty = head[0] && head[0].isDirty;

    //suggestion works very subjectively
    const suggestAction =
      pullVer > headVer
        ? headIsDirty
          ? "⬆️need PUSH"
          : "🈲need MERGE"
        : headIsDirty
          ? "⬆️need PUSH"
          : "✅UP2DATE";

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

          <span>{context.isOnline ? "🌐online" : "🚫offline"}</span>

          <button onClick={() => this.openDialog(DialogTypes.NEW, {})}>
            {MARK.NEW} Add 💰
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
          <button onClick={this.onMergeClick}>Ⓜ️ merge</button>
          <button onClick={this.onPushClick}>⬆️ push</button>
          <button onClick={this.onEmptyClick}>🗑 empty head</button>
        </div>
        <div className="fl-col">
          <span>
            PULL: [{lastPull && lastPull.transactions.length}] {pullVer}
          </span>
          <span>
            HEAD: [{head.length}] {headVer}
          </span>
          <span>{suggestAction}</span>
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
