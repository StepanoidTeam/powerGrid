(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{10:function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nvar fakeReport = exports.fakeReport = {\n  user: "Dawa",\n  balances: [{ user: "Igor", paidForYou: 2, oweToYou: 3, owe: 1 }, { user: "Bulko", paidForYou: 0, oweToYou: 0, owe: 0 }, { user: "Bob", paidForYou: 461.99, oweToYou: 0, owe: -461.99 }]\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvZmFrZVJlcG9ydC5qcz9mZGY4Il0sIm5hbWVzIjpbImZha2VSZXBvcnQiLCJ1c2VyIiwiYmFsYW5jZXMiLCJwYWlkRm9yWW91Iiwib3dlVG9Zb3UiLCJvd2UiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sSUFBTUEsa0NBQWE7QUFDeEJDLFFBQU0sTUFEa0I7QUFFeEJDLFlBQVUsQ0FDUixFQUFFRCxNQUFNLE1BQVIsRUFBZ0JFLFlBQVksQ0FBNUIsRUFBK0JDLFVBQVUsQ0FBekMsRUFBNENDLEtBQUssQ0FBakQsRUFEUSxFQUVSLEVBQUVKLE1BQU0sT0FBUixFQUFpQkUsWUFBWSxDQUE3QixFQUFnQ0MsVUFBVSxDQUExQyxFQUE2Q0MsS0FBSyxDQUFsRCxFQUZRLEVBR1IsRUFBRUosTUFBTSxLQUFSLEVBQWVFLFlBQVksTUFBM0IsRUFBbUNDLFVBQVUsQ0FBN0MsRUFBZ0RDLEtBQUssQ0FBQyxNQUF0RCxFQUhRO0FBRmMsQ0FBbkIiLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgZmFrZVJlcG9ydCA9IHtcbiAgdXNlcjogXCJEYXdhXCIsXG4gIGJhbGFuY2VzOiBbXG4gICAgeyB1c2VyOiBcIklnb3JcIiwgcGFpZEZvcllvdTogMiwgb3dlVG9Zb3U6IDMsIG93ZTogMSB9LFxuICAgIHsgdXNlcjogXCJCdWxrb1wiLCBwYWlkRm9yWW91OiAwLCBvd2VUb1lvdTogMCwgb3dlOiAwIH0sXG4gICAgeyB1c2VyOiBcIkJvYlwiLCBwYWlkRm9yWW91OiA0NjEuOTksIG93ZVRvWW91OiAwLCBvd2U6IC00NjEuOTkgfVxuICBdXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///10\n')},15:function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nexports.clearStore = clearStore;\n\nvar _debounce = __webpack_require__(45);\n\nvar _debounce2 = _interopRequireDefault(_debounce);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nvar Store = function () {\n  function Store(key, initialValue) {\n    _classCallCheck(this, Store);\n\n    _initialiseProps.call(this);\n\n    this.key = key;\n    var value = this.getItem(this.key) || initialValue;\n    return new Proxy(value, this.handler);\n  }\n\n  _createClass(Store, [{\n    key: "getItem",\n    value: function getItem(key) {\n      var valueRaw = window.localStorage.getItem(key);\n      var value = JSON.parse(valueRaw);\n      return value || null;\n    }\n  }, {\n    key: "setItem",\n    value: function setItem(key, value) {\n      var valueRaw = JSON.stringify(value);\n      window.localStorage.setItem(key, valueRaw);\n    }\n  }]);\n\n  return Store;\n}();\n\n//todo: make as a part of store\n\n\nvar _initialiseProps = function _initialiseProps() {\n  var _this = this;\n\n  this.handler = {\n    get: function get(target, property) {\n      return target[property];\n    },\n    set: function set(target, property, value) {\n      target[property] = value;\n\n      _this.save(target);\n      return true;\n    }\n  };\n  this.save = (0, _debounce2.default)(function (value) {\n    _this.setItem(_this.key, value);\n  }, 500);\n};\n\nexports.default = Store;\nfunction clearStore(target) {\n  Object.keys(target).forEach(function (key) {\n    delete target[key];\n  });\n  return target;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvc3RvcmUuanM/NmFiMSJdLCJuYW1lcyI6WyJjbGVhclN0b3JlIiwiU3RvcmUiLCJrZXkiLCJpbml0aWFsVmFsdWUiLCJ2YWx1ZSIsImdldEl0ZW0iLCJQcm94eSIsImhhbmRsZXIiLCJ2YWx1ZVJhdyIsIndpbmRvdyIsImxvY2FsU3RvcmFnZSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJnZXQiLCJ0YXJnZXQiLCJwcm9wZXJ0eSIsInNldCIsInNhdmUiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFzQ2dCQSxVLEdBQUFBLFU7O0FBdENoQjs7Ozs7Ozs7SUFFcUJDLEs7QUFpQm5CLGlCQUFZQyxHQUFaLEVBQWlCQyxZQUFqQixFQUErQjtBQUFBOztBQUFBOztBQUM3QixTQUFLRCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxRQUFNRSxRQUFRLEtBQUtDLE9BQUwsQ0FBYSxLQUFLSCxHQUFsQixLQUEwQkMsWUFBeEM7QUFDQSxXQUFPLElBQUlHLEtBQUosQ0FBVUYsS0FBVixFQUFpQixLQUFLRyxPQUF0QixDQUFQO0FBQ0Q7Ozs7NEJBRU9MLEcsRUFBSztBQUNYLFVBQU1NLFdBQVdDLE9BQU9DLFlBQVAsQ0FBb0JMLE9BQXBCLENBQTRCSCxHQUE1QixDQUFqQjtBQUNBLFVBQUlFLFFBQVFPLEtBQUtDLEtBQUwsQ0FBV0osUUFBWCxDQUFaO0FBQ0EsYUFBT0osU0FBUyxJQUFoQjtBQUNEOzs7NEJBRU9GLEcsRUFBS0UsSyxFQUFPO0FBQ2xCLFVBQU1JLFdBQVdHLEtBQUtFLFNBQUwsQ0FBZVQsS0FBZixDQUFqQjtBQUNBSyxhQUFPQyxZQUFQLENBQW9CSSxPQUFwQixDQUE0QlosR0FBNUIsRUFBaUNNLFFBQWpDO0FBQ0Q7Ozs7OztBQUdIOzs7Ozs7T0FsQ0VELE8sR0FBVTtBQUNSUSxTQUFLLGFBQUNDLE1BQUQsRUFBU0MsUUFBVCxFQUFzQjtBQUN6QixhQUFPRCxPQUFPQyxRQUFQLENBQVA7QUFDRCxLQUhPO0FBSVJDLFNBQUssYUFBQ0YsTUFBRCxFQUFTQyxRQUFULEVBQW1CYixLQUFuQixFQUE2QjtBQUNoQ1ksYUFBT0MsUUFBUCxJQUFtQmIsS0FBbkI7O0FBRUEsWUFBS2UsSUFBTCxDQUFVSCxNQUFWO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFUTyxHO09BWVZHLEksR0FBTyx3QkFBUyxpQkFBUztBQUN2QixVQUFLTCxPQUFMLENBQWEsTUFBS1osR0FBbEIsRUFBdUJFLEtBQXZCO0FBQ0QsR0FGTSxFQUVKLEdBRkksQzs7O2tCQWJZSCxLO0FBb0NkLFNBQVNELFVBQVQsQ0FBb0JnQixNQUFwQixFQUE0QjtBQUNqQ0ksU0FBT0MsSUFBUCxDQUFZTCxNQUFaLEVBQW9CTSxPQUFwQixDQUE0QixVQUFTcEIsR0FBVCxFQUFjO0FBQ3hDLFdBQU9jLE9BQU9kLEdBQVAsQ0FBUDtBQUNELEdBRkQ7QUFHQSxTQUFPYyxNQUFQO0FBQ0QiLCJmaWxlIjoiMTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC9kZWJvdW5jZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZSB7XG4gIGhhbmRsZXIgPSB7XG4gICAgZ2V0OiAodGFyZ2V0LCBwcm9wZXJ0eSkgPT4ge1xuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkgPT4ge1xuICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuXG4gICAgICB0aGlzLnNhdmUodGFyZ2V0KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBzYXZlID0gZGVib3VuY2UodmFsdWUgPT4ge1xuICAgIHRoaXMuc2V0SXRlbSh0aGlzLmtleSwgdmFsdWUpO1xuICB9LCA1MDApO1xuXG4gIGNvbnN0cnVjdG9yKGtleSwgaW5pdGlhbFZhbHVlKSB7XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEl0ZW0odGhpcy5rZXkpIHx8IGluaXRpYWxWYWx1ZTtcbiAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCB0aGlzLmhhbmRsZXIpO1xuICB9XG5cbiAgZ2V0SXRlbShrZXkpIHtcbiAgICBjb25zdCB2YWx1ZVJhdyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UodmFsdWVSYXcpO1xuICAgIHJldHVybiB2YWx1ZSB8fCBudWxsO1xuICB9XG5cbiAgc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgdmFsdWVSYXcgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWVSYXcpO1xuICB9XG59XG5cbi8vdG9kbzogbWFrZSBhcyBhIHBhcnQgb2Ygc3RvcmVcbmV4cG9ydCBmdW5jdGlvbiBjbGVhclN0b3JlKHRhcmdldCkge1xuICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///15\n')},4:function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.GIT = exports.currency = exports.NetworkError = undefined;\n\nvar _store = __webpack_require__(15);\n\nvar _store2 = _interopRequireDefault(_store);\n\nvar _fakeReport = __webpack_require__(10);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar NetworkError = exports.NetworkError = function (_Error) {\n  _inherits(NetworkError, _Error);\n\n  function NetworkError(value) {\n    _classCallCheck(this, NetworkError);\n\n    var _this = _possibleConstructorReturn(this, (NetworkError.__proto__ || Object.getPrototypeOf(NetworkError)).call(this, value));\n\n    _this.message = "Network problems";\n    return _this;\n  }\n\n  return NetworkError;\n}(Error);\n\nvar config = {\n  httpUrl: "//pg-api.azurewebsites.net/api/",\n  //httpUrl: \'http://localhost:5000/api/\',\n\n  routes: {\n    Login: "login.html",\n    Transactions: "index.html",\n    Report: "report.html"\n  }\n};\n\nvar currency = exports.currency = "💶"; //"€";\n\nvar GIT = exports.GIT = {\n  //API\n  push: function push() {\n    //send new to server\n  },\n  pull: function pull() {\n    //get all from server\n  },\n  merge: function merge(oldValues, newValues) {\n    //merge local + server\n\n    // total replace for now\n    return oldValues.splice.apply(oldValues, [0, oldValues.length + 1].concat(_toConsumableArray(newValues)));\n  }\n};\n\nvar app = {\n  //todo: remove this\n  context: {},\n\n  init: function init(_ref) {\n    var updateIsLogged = _ref.updateIsLogged;\n\n    //todo: remove context prosloyka\n    app.context.CurrentUser = new _store2.default("current-user", {});\n    app.context.CurrentRoom = new _store2.default("current-room", {\n      Id: "",\n      Name: ""\n    });\n    app.context.Settings = new _store2.default("current-settings", {\n      filterBy: null\n    });\n\n    app.updateIsLogged = updateIsLogged;\n    app.updateIsLogged();\n    //todo: if empty room - redir to login?\n    var prefix = app.context.CurrentRoom.Id;\n    app.context.head = new _store2.default(prefix + ":transactions", []);\n    app.context.report = new _store2.default(prefix + ":report", _fakeReport.fakeReport);\n    app.context.transactionLogs = new _store2.default(prefix + ":transactionLogs", {\n      logs: [],\n      version: 0\n    });\n\n    console.log("@@", app.context.head);\n  },\n  isLogged: function isLogged() {\n    return !!app.context.CurrentUser.Id;\n  },\n  logger: function logger(data) {\n    console.log("logger", data);\n    return data;\n  },\n  ajax: function ajax(actionUrl) {\n    var _this2 = this;\n\n    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "POST";\n\n    var authKey = app.context.CurrentUser.AuthToken || null;\n\n    var ajaxUrl = config.httpUrl + actionUrl;\n    var body = JSON.stringify(data);\n\n    return fetch(ajaxUrl, {\n      method: method,\n      body: body,\n      headers: {\n        authToken: authKey,\n        "Content-Type": "application/json"\n      },\n      mode: "cors",\n      cache: "no-cache"\n    }).then(function (response) {\n      if (response.ok) {\n        return response.json();\n      }\n      throw response;\n    }).then(function (response) {\n      return response.data;\n    }).then(app.logger).catch(function (error) {\n      if (error instanceof TypeError) {\n        throw new NetworkError(error);\n      }\n\n      //todo: check if actual\n      if (error.status === 401) {\n        _this2.logout();\n      }\n\n      return error.json().then(function (errorModel) {\n        console.log("errorModel", errorModel);\n        throw errorModel;\n      });\n    });\n  },\n  onLoginDone: function onLoginDone(user) {\n    Object.assign(app.context.CurrentUser, user);\n    //do we need to?\n    app.updateIsLogged();\n  },\n\n\n  //auth mapper\n  extractUser: function extractUser(response) {\n    return response.data;\n  },\n  getReport: function getReport() {\n    return app.ajax("trans/report").then(function (response) {\n      return response.data;\n    }).then(function (userReports) {\n      var currentUserReport = userReports.find(function (urep) {\n        return urep.user === app.context.CurrentUser.Name;\n      });\n\n      Object.assign(app.context.report, currentUserReport);\n    });\n  },\n  getLogs: function getLogs(data) {\n    return app.ajax("trans/getLogs", data).then(function (response) {\n      return response.data;\n    }).then(function (resp) {\n      app.context.transactionLogs.version = resp.version;\n      resp.logs.forEach(function (log) {\n        app.context.transactionLogs.logs.push(log);\n      });\n    });\n  },\n  sync: function sync(data) {\n    return app.ajax("trans/sync", data);\n  },\n  logout: function logout() {\n    (0, _store.clearStore)(app.context.CurrentUser);\n    //todo: clear store immediately?\n    localStorage.clear();\n\n    app.updateIsLogged();\n  },\n  login: function login(user) {\n    return app.ajax("auth/login", user).then(app.onLoginDone);\n  },\n  register: function register(user) {\n    return app.ajax("auth/register", user).then(app.onLoginDone);\n  },\n  loadCurrentRoom: function loadCurrentRoom() {\n    //todo: handle offline error\n    return app.ajax("room/status").then(function (room) {\n      Object.assign(app.context.CurrentRoom, room);\n    });\n  }\n};\n\nexports.default = app;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvYXBwLmpzPzkwZTkiXSwibmFtZXMiOlsiTmV0d29ya0Vycm9yIiwidmFsdWUiLCJtZXNzYWdlIiwiRXJyb3IiLCJjb25maWciLCJodHRwVXJsIiwicm91dGVzIiwiTG9naW4iLCJUcmFuc2FjdGlvbnMiLCJSZXBvcnQiLCJjdXJyZW5jeSIsIkdJVCIsInB1c2giLCJwdWxsIiwibWVyZ2UiLCJvbGRWYWx1ZXMiLCJuZXdWYWx1ZXMiLCJzcGxpY2UiLCJsZW5ndGgiLCJhcHAiLCJjb250ZXh0IiwiaW5pdCIsInVwZGF0ZUlzTG9nZ2VkIiwiQ3VycmVudFVzZXIiLCJTdG9yZSIsIkN1cnJlbnRSb29tIiwiSWQiLCJOYW1lIiwiU2V0dGluZ3MiLCJmaWx0ZXJCeSIsInByZWZpeCIsImhlYWQiLCJyZXBvcnQiLCJmYWtlUmVwb3J0IiwidHJhbnNhY3Rpb25Mb2dzIiwibG9ncyIsInZlcnNpb24iLCJjb25zb2xlIiwibG9nIiwiaXNMb2dnZWQiLCJsb2dnZXIiLCJkYXRhIiwiYWpheCIsImFjdGlvblVybCIsIm1ldGhvZCIsImF1dGhLZXkiLCJBdXRoVG9rZW4iLCJhamF4VXJsIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZXRjaCIsImhlYWRlcnMiLCJhdXRoVG9rZW4iLCJtb2RlIiwiY2FjaGUiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJjYXRjaCIsImVycm9yIiwiVHlwZUVycm9yIiwic3RhdHVzIiwibG9nb3V0IiwiZXJyb3JNb2RlbCIsIm9uTG9naW5Eb25lIiwidXNlciIsIk9iamVjdCIsImFzc2lnbiIsImV4dHJhY3RVc2VyIiwiZ2V0UmVwb3J0IiwiY3VycmVudFVzZXJSZXBvcnQiLCJ1c2VyUmVwb3J0cyIsImZpbmQiLCJ1cmVwIiwiZ2V0TG9ncyIsInJlc3AiLCJmb3JFYWNoIiwic3luYyIsImxvY2FsU3RvcmFnZSIsImNsZWFyIiwibG9naW4iLCJyZWdpc3RlciIsImxvYWRDdXJyZW50Um9v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Q1YsV0FBT2hELElBQUl1QixJQUFKLENBQVMsWUFBVCxFQUF1QnlCLElBQXZCLEVBQTZCWCxJQUE3QixDQUFrQ3JDLElBQUkrQyxXQUF0QyxDQUFQO0FBQ0QsR0FqSVM7QUFtSVZpQixVQW5JVSxvQkFtSURoQixJQW5JQyxFQW1JSztBQUNiLFdBQU9oRCxJQUFJdUIsSUFBSixDQUFTLGVBQVQsRUFBMEJ5QixJQUExQixFQUFnQ1gsSUFBaEMsQ0FBcUNyQyxJQUFJK0MsV0FBekMsQ0FBUDtBQUNELEdBcklTO0FBdUlWa0IsaUJBdklVLDZCQXVJUTtBQUNoQjtBQUNBLFdBQU9qRSxJQUFJdUIsSUFBSixDQUFTLGFBQVQsRUFBd0JjLElBQXhCLENBQTZCLGdCQUFRO0FBQzFDWSxhQUFPQyxNQUFQLENBQWNsRCxJQUFJQyxPQUFKLENBQVlLLFdBQTFCLEVBQXVDNEQsSUFBdkM7QUFDRCxLQUZNLENBQVA7QUFHRDtBQTVJUyxDQUFaOztrQkErSWVsRSxHIiwiZmlsZSI6IjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUsIHsgY2xlYXJTdG9yZSB9IGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgeyBmYWtlUmVwb3J0IH0gZnJvbSBcIi4vZmFrZVJlcG9ydFwiO1xuXG5leHBvcnQgY2xhc3MgTmV0d29ya0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHN1cGVyKHZhbHVlKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBcIk5ldHdvcmsgcHJvYmxlbXNcIjtcbiAgfVxufVxuXG5jb25zdCBjb25maWcgPSB7XG4gIGh0dHBVcmw6IFwiLy9wZy1hcGkuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1wiLFxuICAvL2h0dHBVcmw6ICdodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpLycsXG5cbiAgcm91dGVzOiB7XG4gICAgTG9naW46IFwibG9naW4uaHRtbFwiLFxuICAgIFRyYW5zYWN0aW9uczogXCJpbmRleC5odG1sXCIsXG4gICAgUmVwb3J0OiBcInJlcG9ydC5odG1sXCJcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGN1cnJlbmN5ID0gXCLwn5K2XCI7IC8vXCLigqxcIjtcblxuZXhwb3J0IGNvbnN0IEdJVCA9IHtcbiAgLy9BUElcbiAgcHVzaCgpIHtcbiAgICAvL3NlbmQgbmV3IHRvIHNlcnZlclxuICB9LFxuXG4gIHB1bGwoKSB7XG4gICAgLy9nZXQgYWxsIGZyb20gc2VydmVyXG4gIH0sXG5cbiAgbWVyZ2Uob2xkVmFsdWVzLCBuZXdWYWx1ZXMpIHtcbiAgICAvL21lcmdlIGxvY2FsICsgc2VydmVyXG5cbiAgICAvLyB0b3RhbCByZXBsYWNlIGZvciBub3dcbiAgICByZXR1cm4gb2xkVmFsdWVzLnNwbGljZSgwLCBvbGRWYWx1ZXMubGVuZ3RoICsgMSwgLi4ubmV3VmFsdWVzKTtcbiAgfVxufTtcblxuY29uc3QgYXBwID0ge1xuICAvL3RvZG86IHJlbW92ZSB0aGlzXG4gIGNvbnRleHQ6IHt9LFxuXG4gIGluaXQoeyB1cGRhdGVJc0xvZ2dlZCB9KSB7XG4gICAgLy90b2RvOiByZW1vdmUgY29udGV4dCBwcm9zbG95a2FcbiAgICBhcHAuY29udGV4dC5DdXJyZW50VXNlciA9IG5ldyBTdG9yZShgY3VycmVudC11c2VyYCwge30pO1xuICAgIGFwcC5jb250ZXh0LkN1cnJlbnRSb29tID0gbmV3IFN0b3JlKGBjdXJyZW50LXJvb21gLCB7XG4gICAgICBJZDogXCJcIixcbiAgICAgIE5hbWU6IFwiXCJcbiAgICB9KTtcbiAgICBhcHAuY29udGV4dC5TZXR0aW5ncyA9IG5ldyBTdG9yZShgY3VycmVudC1zZXR0aW5nc2AsIHtcbiAgICAgIGZpbHRlckJ5OiBudWxsXG4gICAgfSk7XG5cbiAgICBhcHAudXBkYXRlSXNMb2dnZWQgPSB1cGRhdGVJc0xvZ2dlZDtcbiAgICBhcHAudXBkYXRlSXNMb2dnZWQoKTtcbiAgICAvL3RvZG86IGlmIGVtcHR5IHJvb20gLSByZWRpciB0byBsb2dpbj9cbiAgICBjb25zdCBwcmVmaXggPSBhcHAuY29udGV4dC5DdXJyZW50Um9vbS5JZDtcbiAgICBhcHAuY29udGV4dC5oZWFkID0gbmV3IFN0b3JlKGAke3ByZWZpeH06dHJhbnNhY3Rpb25zYCwgW10pO1xuICAgIGFwcC5jb250ZXh0LnJlcG9ydCA9IG5ldyBTdG9yZShgJHtwcmVmaXh9OnJlcG9ydGAsIGZha2VSZXBvcnQpO1xuICAgIGFwcC5jb250ZXh0LnRyYW5zYWN0aW9uTG9ncyA9IG5ldyBTdG9yZShgJHtwcmVmaXh9OnRyYW5zYWN0aW9uTG9nc2AsIHtcbiAgICAgIGxvZ3M6IFtdLFxuICAgICAgdmVyc2lvbjogMFxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coXCJAQFwiLCBhcHAuY29udGV4dC5oZWFkKTtcbiAgfSxcblxuICBpc0xvZ2dlZCgpIHtcbiAgICByZXR1cm4gISFhcHAuY29udGV4dC5DdXJyZW50VXNlci5JZDtcbiAgfSxcblxuICBsb2dnZXIoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKFwibG9nZ2VyXCIsIGRhdGEpO1xuICAgIHJldHVybiBkYXRhO1xuICB9LFxuXG4gIGFqYXgoYWN0aW9uVXJsLCBkYXRhID0ge30sIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgY29uc3QgYXV0aEtleSA9IGFwcC5jb250ZXh0LkN1cnJlbnRVc2VyLkF1dGhUb2tlbiB8fCBudWxsO1xuXG4gICAgY29uc3QgYWpheFVybCA9IGNvbmZpZy5odHRwVXJsICsgYWN0aW9uVXJsO1xuICAgIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcblxuICAgIHJldHVybiBmZXRjaChhamF4VXJsLCB7XG4gICAgICBtZXRob2QsXG4gICAgICBib2R5LFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBhdXRoVG9rZW46IGF1dGhLZXksXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICB9LFxuICAgICAgbW9kZTogXCJjb3JzXCIsXG4gICAgICBjYWNoZTogXCJuby1jYWNoZVwiXG4gICAgfSlcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5kYXRhKVxuICAgICAgLnRoZW4oYXBwLmxvZ2dlcilcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90b2RvOiBjaGVjayBpZiBhY3R1YWxcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlcnJvci5qc29uKCkudGhlbihlcnJvck1vZGVsID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yTW9kZWxcIiwgZXJyb3JNb2RlbCk7XG4gICAgICAgICAgdGhyb3cgZXJyb3JNb2RlbDtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSxcblxuICBvbkxvZ2luRG9uZSh1c2VyKSB7XG4gICAgT2JqZWN0LmFzc2lnbihhcHAuY29udGV4dC5DdXJyZW50VXNlciwgdXNlcik7XG4gICAgLy9kbyB3ZSBuZWVkIHRvP1xuICAgIGFwcC51cGRhdGVJc0xvZ2dlZCgpO1xuICB9LFxuXG4gIC8vYXV0aCBtYXBwZXJcbiAgZXh0cmFjdFVzZXIocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfSxcblxuICBnZXRSZXBvcnQoKSB7XG4gICAgcmV0dXJuIGFwcFxuICAgICAgLmFqYXgoXCJ0cmFucy9yZXBvcnRcIilcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmRhdGEpXG4gICAgICAudGhlbih1c2VyUmVwb3J0cyA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRVc2VyUmVwb3J0ID0gdXNlclJlcG9ydHMuZmluZChcbiAgICAgICAgICB1cmVwID0+IHVyZXAudXNlciA9PT0gYXBwLmNvbnRleHQuQ3VycmVudFVzZXIuTmFtZVxuICAgICAgICApO1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYXBwLmNvbnRleHQucmVwb3J0LCBjdXJyZW50VXNlclJlcG9ydCk7XG4gICAgICB9KTtcbiAgfSxcblxuICBnZXRMb2dzKGRhdGEpIHtcbiAgICByZXR1cm4gYXBwXG4gICAgICAuYWpheChcInRyYW5zL2dldExvZ3NcIiwgZGF0YSlcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmRhdGEpXG4gICAgICAudGhlbihyZXNwID0+IHtcbiAgICAgICAgYXBwLmNvbnRleHQudHJhbnNhY3Rpb25Mb2dzLnZlcnNpb24gPSByZXNwLnZlcnNpb247XG4gICAgICAgIHJlc3AubG9ncy5mb3JFYWNoKGxvZyA9PiB7XG4gICAgICAgICAgYXBwLmNvbnRleHQudHJhbnNhY3Rpb25Mb2dzLmxvZ3MucHVzaChsb2cpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9LFxuXG4gIHN5bmMoZGF0YSkge1xuICAgIHJldHVybiBhcHAuYWpheChcInRyYW5zL3N5bmNcIiwgZGF0YSk7XG4gIH0sXG5cbiAgbG9nb3V0KCkge1xuICAgIGNsZWFyU3RvcmUoYXBwLmNvbnRleHQuQ3VycmVudFVzZXIpO1xuICAgIC8vdG9kbzogY2xlYXIgc3RvcmUgaW1tZWRpYXRlbHk/XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG5cbiAgICBhcHAudXBkYXRlSXNMb2dnZWQoKTtcbiAgfSxcblxuICBsb2dpbih1c2VyKSB7XG4gICAgcmV0dXJuIGFwcC5hamF4KFwiYXV0aC9sb2dpblwiLCB1c2VyKS50aGVuKGFwcC5vbkxvZ2luRG9uZSk7XG4gIH0sXG5cbiAgcmVnaXN0ZXIodXNlcikge1xuICAgIHJldHVybiBhcHAuYWpheChcImF1dGgvcmVnaXN0ZXJcIiwgdXNlcikudGhlbihhcHAub25Mb2dpbkRvbmUpO1xuICB9LFxuXG4gIGxvYWRDdXJyZW50Um9vbSgpIHtcbiAgICAvL3RvZG86IGhhbmRsZSBvZmZsaW5lIGVycm9yXG4gICAgcmV0dXJuIGFwcC5hamF4KFwicm9vbS9zdGF0dXNcIikudGhlbihyb29tID0+IHtcbiAgICAgIE9iamVjdC5hc3NpZ24oYXBwLmNvbnRleHQuQ3VycmVudFJvb20sIHJvb20pO1xuICAgIH0pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///4\n')}},[[4,1,0]]]);