const Vue = require("vue/dist/vue.js")
const Rx = require("rxjs")


import {Model, Event} from '../shared/Model'

const WebSocketSubject = require("rxjs/observable/dom/WebSocketSubject").WebSocketSubject


require("./ClientMouse").register(Vue)
require("./ClientMiceContainer").register(Vue)

var ws = WebSocketSubject.create('ws://localhost:3000/clients')

const app = new Vue({
  el: '#app',
  template: require("./client.html"),

  data: function() {
    return {
      currentId: null
    }
  },

  methods: {
    registerNewUser: function() {
      let label = this.$refs.userLabel.value
      ws.socket.send(JSON.stringify({
        type: Event.REGISTER_CLIENT,
        label: label
      }))
    }
  }
})

var wsSubject = ws.subscribe(function(e) {
//  console.log("message: ", e);
})

ws.filter((message) => message.type == Event.NEW_CLIENTS)
    .flatMap((message) => message.clients)
    .forEach((user) => Model.get().addClient(user));

ws.filter((message) => message.type == Event.REMOVE_CLIENTS)
    .flatMap((message) => message.clients)
    .forEach((user) => Model.get().removeClient(user));

ws.filter((message) => message.type == Event.REPOSITION_CLIENTS)
    .flatMap((message) => message.clients)
    .forEach(client => {
      const localClient = Model.get().clientMap[client.id]
      localClient.x = client.x
      localClient.y = client.y
    });

ws.filter((message) => message.type == Event.REGISTERED_ID)
    .subscribe(function(ev) {
    	app.currentId = ev.uid
    });

let mouseOver = Rx.Observable.fromEvent(document.getElementById('mice-container'), 'mouseover')
let mouseEnter = Rx.Observable.fromEvent(document.getElementById('mice-container'), 'mouseenter')
let mouseLeave = Rx.Observable.fromEvent(document.getElementById('mice-container'), 'mouseleave')
let mouseMove = Rx.Observable.fromEvent(document.getElementById('mice-container'), 'mousemove')

Rx.Observable.merge(mouseOver, mouseEnter, mouseLeave, mouseMove)
    .sample(Rx.Observable.interval(20))
    .subscribe(function(ev) {
      ws.socket.send(JSON.stringify({
        type: Event.MOVE_CLIENT,
        id: app.currentId,
        x: ev.x,
        y: ev.y
      }))
    });



window.ws = ws
window.Rx = Rx

