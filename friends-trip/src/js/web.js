import React from "react";
import _remove from "lodash/remove";
import _sortBy from "lodash/sortBy";

import app, { GIT, NetworkError } from "./app.js";
import Grid from "../components/grid/grid.jsx";
import Dialog from "../components/dialog/dialog";
import TransactionDialog, {
  DialogTypes
} from "../components/transaction-dialog/transaction-dialog.jsx";
import Overlay from "../components/overlay/overlay.jsx";

import { Fab } from "rmwc";
import { Button, ButtonIcon } from "rmwc/Button";
import {
  Chip,
  ChipIcon,
  ChipText,
  ChipCheckmark,
  ChipSet,
  SimpleChip
} from "rmwc/Chip";

import { Snackbar } from "rmwc/Snackbar";

import { SimpleDialog } from "rmwc/Dialog";

import {
  Toolbar,
  ToolbarRow,
  ToolbarTitle,
  ToolbarFixedAdjust,
  ToolbarSection,
  ToolbarIcon,
  ToolbarMenuIcon
} from "rmwc/Toolbar";

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
    head: [],
    dialog: { isOpen: false },
    error: null,
    isOnline: false,
    isLoading: false
  };

  offlineErrorHandler = error => {
    //todo: check and handle ONLY offline error
    //todo: re-raise others

    if (error instanceof NetworkError) {
      this.showError(`seems offline ${error}`, 1000);
      this.checkOnline();
      return error;
    }

    throw error;
  };

  unknownErrorHandler = errorModel => {
    console.warn(errorModel);
    this.showError(`⛔️${errorModel || "kakoy-to bag"}`);
  };

  showError(errorData) {
    this.setState({
      lastError: errorData.toString()
    });
  }

  updateStateFromContext() {
    console.warn("remove that shit");
    this.setState(app.context);
    this.setState({ isLoading: false });
  }

  componentDidMount() {
    // todo: run all init shit here

    this.checkOnline();

    this.setState({ isLoading: true });
    app.loadCurrentRoom();

    this.updateStateFromContext();

    //on page start
    this.gitpush().finally(() => {
      this.updateStateFromContext();
      this.setState({ isLoading: false });
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

  gitcommitChange(item) {
    item.isDirty = true;

    if (item.id) {
      //edited
      //todo: replace in store
      _remove(app.context.head, { id: item.id });
      app.context.head.unshift(item);
    } else {
      //new
      //adhoc to remove prev edited NEW record
      _remove(app.context.head, { fakeid: item.fakeid });
      //to deal with next edit for new item
      item.fakeid = +new Date();
      //todo: put in store
      app.context.head.unshift(item);
    }

    this.setState({ isLoading: true });

    //after commit
    this.gitpush().finally(() => {
      this.updateStateFromContext();
      this.setState({ isLoading: false });
    });
  }

  gitpush() {
    const { head } = this.state;
    //remove from LS all changes, send to server,
    const allDirty = head.filter(t => t.isDirty);
    _remove(head, t => t.isDirty);

    //debug
    console.group("DIFF:");
    console.log(`${MARK.NEW}new`, allDirty.filter(t => !t.id));
    console.log(`${MARK.EDIT}edited`, allDirty.filter(t => t.id));
    console.log(JSON.stringify(allDirty));
    console.groupEnd();

    return app
      .sync({
        transactions: allDirty
      })
      .then(response => {
        if (response.pushResult.length === 0) {
          console.log("PUSH Success, no Errors");
        } else {
          //todo: then if any errors - put back to LS from response
          throw new Error("PUSH conflicts", response.pushResult);
        }
        return response;
      })
      .then(response => {
        const { head } = this.state;
        this.gitmerge(head, response.pullResult.transactions);

        return response;
      })
      .catch(error => {
        //rollback
        head.unshift(...allDirty);
        throw error;
      })
      .catch(this.offlineErrorHandler)
      .catch(this.unknownErrorHandler);
  }

  gitmerge(head, pull = []) {
    const toadd = [];

    pull.forEach(tpull => {
      const thead = head.find(t => t.id === tpull.id);

      if (!thead) {
        //not found - add new
        toadd.push(tpull);
      } else {
        //found
        if (!thead.isDirty) {
          //pure - can be updated
          _remove(head, { id: thead.id });
          toadd.push(tpull);
        } else {
          //modified - merge conflict!
          //todo: something with that
          if (tpull.version > thead.version) {
            //fresher
            console.warn("MERGE conflict", "head", thead, "pull", tpull);

            this.showError(
              <div className="fl-col">
                <span>⚠️MERGE conflict:</span>
                <span>HEAD</span>
                <textarea defaultValue={JSON.stringify(thead)} />
                <span>pull</span>
                <textarea defaultValue={JSON.stringify(tpull)} />
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

    console.log("MERGE done");
  }

  onPushClick = () => {
    this.checkOnline();
    this.setState({ isLoading: true });

    //on sync
    this.gitpush().finally(() => {
      this.updateStateFromContext();
      this.setState({ isLoading: false });
    });
  };

  onEmptyClick = () => {
    const { head } = this.state;
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
      isLoading,
      dialog,
      CurrentRoom: room,
      CurrentUser: user,
      head
    } = context;

    const filterBy = context.Settings.filterBy;

    if (!room || !room.Users || !user || !head) return null;

    const filteredTransactions = filterBy
      ? head.filter(trans => trans.creditorName === filterBy)
      : head;

    //suggestion works very subjectively
    const headIsDirty = head[0] && head[0].isDirty;
    const cloudIcon = context.isOnline
      ? headIsDirty
        ? "cloud_upload"
        : "cloud_download"
      : "cloud_off";

    return (
      <div>
        <Toolbar fixed>
          <ToolbarRow>
            <ToolbarMenuIcon use="menu" />
            <ToolbarTitle>
              ✈️
              {room.Name}
            </ToolbarTitle>

            <ToolbarSection alignEnd>
              <ToolbarIcon use={cloudIcon} onClick={this.onPushClick} />
              <ToolbarIcon use="delete_forever" onClick={this.onEmptyClick} />
              <ToolbarIcon use="exit_to_app" onClick={logout} />
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        <ToolbarFixedAdjust />
        <ToolbarFixedAdjust />

        <Overlay isOpen={isLoading}>⏳Loading...</Overlay>

        <span id="logs" />

        <div className="head-block fl-row">
          <ChipSet filter>
            {room.Users.map((user, i) => {
              const isSelected = filterBy === user.Name;
              return (
                <SimpleChip
                  key={i}
                  selected={isSelected}
                  onClick={() => this.filterBy(isSelected ? "" : user.Name)}
                  checkmark
                  leadingIcon="search"
                  text={user.Name}
                />
              );
            })}
          </ChipSet>
        </div>

        <Fab
          icon="note_add"
          className="fab-add-transaction"
          onClick={() => this.openDialog(DialogTypes.NEW, {})}
        />

        <div className="main-block fl-row">
          <Grid
            data={filteredTransactions}
            onItemSelected={item => this.openDialog(DialogTypes.EDIT, item)}
          />
        </div>

        <TransactionDialog
          users={room.Users}
          creditor={user}
          isOpen={dialog.isOpen}
          type={dialog.type}
          item={dialog.item}
          onClose={data => this.closeDialog(data)}
        />

        <Snackbar
          show={this.state.lastError}
          message={<div>{this.state.lastError}</div>}
          alignStart
        />
      </div>
    );
  }
}
