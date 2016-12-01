require("source-map-support/register");

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _Model = __webpack_require__(3);
	
	var Express = __webpack_require__(4);
	var uuid = __webpack_require__(5);
	
	
	var app = new Express();
	var ws = __webpack_require__(6)(app);
	
	app.use(Express.static("out/public"));
	
	var index = 0;
	
	var clientSockets = {};
	
	app.ws('/clients', function (ws, req) {
	  var clientId = uuid();
	
	  clientSockets[clientId] = ws;
	
	  ws.send(JSON.stringify({
	    type: _Model.Event.NEW_CLIENTS,
	    clients: _Model.Model.get().clientList
	  }));
	
	  ws.on('message', function (msg) {
	    msg = JSON.parse(msg);
	    console.log("new message: ", msg, _Model.Event.REGISTER_CLIENT);
	    if (msg.type == _Model.Event.REGISTER_CLIENT) {
	      (function () {
	        console.log("new client registered", clientId);
	        ws.send(JSON.stringify({
	          type: _Model.Event.REGISTERED_ID,
	          uid: clientId
	        }));
	
	        var newClient = {
	          id: clientId,
	          label: msg.label,
	          x: 0,
	          y: 0
	        };
	
	        _Model.Model.get().addClient(newClient);
	
	        console.log(JSON.stringify(_Model.Model.get().clientMap));
	
	        Object.values(clientSockets).forEach(function (clientWs) {
	          try {
	            clientWs.send(JSON.stringify({
	              type: _Model.Event.NEW_CLIENTS,
	              clients: [newClient]
	            }));
	          } catch (e) {
	            // FIXME: implement
	          }
	        });
	      })();
	    }
	
	    if (msg.type == _Model.Event.MOVE_CLIENT) {
	      var _ret2 = function () {
	        var client = _Model.Model.get().clientMap[msg.id];
	
	        if (!client) {
	          // client is not existing anymore, reconnect
	          // register client normally
	          console.log("client not found: ", msg.id);
	          return {
	            v: void 0
	          };
	        }
	
	        client.x = msg.x;
	        client.y = msg.y;
	
	        // notify the other clients that our guy is out
	        Object.values(clientSockets).forEach(function (clientWs) {
	          try {
	            clientWs.send(JSON.stringify({
	              type: _Model.Event.REPOSITION_CLIENTS,
	              clients: [client]
	            }));
	          } catch (e) {}
	        });
	      }();
	
	      if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
	    }
	  });
	
	  ws.on('close', function (msg) {
	    console.log('client connection closed for', clientId);
	    delete clientSockets[clientId];
	    _Model.Model.get().removeClient({ id: clientId });
	
	    // notify the other clients that our guy is out
	    Object.values(clientSockets).forEach(function (clientWs) {
	      try {
	        clientWs.send(_Model.Event.REMOVED_CLIENTS[{ id: clientId }]);
	      } catch (e) {}
	    });
	  });
	});
	
	app.listen(3000, function () {
	  console.log("listening on 3000");
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Event = exports.Event = {
	  NEW_CLIENTS: "new-clients",
	  REMOVED_CLIENTS: "removed-clients",
	  REGISTER_CLIENT: "register-client",
	  REGISTERED_ID: 'registered-id',
	  MOVE_CLIENT: 'move-client',
	  REPOSITION_CLIENTS: "reposition-clients"
	};
	
	var Mice = exports.Mice = function Mice() {
	  _classCallCheck(this, Mice);
	
	  this.x = 0;
	  this.y = 0;
	  this.label = "A";
	  this.id = null;
	};
	
	var Model = exports.Model = function () {
	  function Model() {
	    _classCallCheck(this, Model);
	
	    this.clientList = [];
	    this.clientMap = {};
	  }
	
	  _createClass(Model, [{
	    key: "addClient",
	    value: function addClient(client) {
	      if (this.clientMap[client.id]) {
	        this.removeClient(client);
	      }
	
	      this.clientList.push(client);
	      this.clientMap[client.id] = client;
	    }
	  }, {
	    key: "removeClient",
	    value: function removeClient(client) {
	      for (var i = 0; i < this.clientList.length; i++) {
	        var item = this.clientList[i];
	        if (item.id == client.id) {
	          this.clientList.splice(i, 1);
	        }
	      }
	      delete this.clientMap[client.id];
	    }
	  }], [{
	    key: "get",
	    value: function get() {
	      return Model.INSTANCE;
	    }
	  }]);
	
	  return Model;
	}();
	
	Model.INSTANCE = new Model();
	
	if (typeof window != "undefined") {
	  window["Model"] = Model;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("uuid");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("express-ws");

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map