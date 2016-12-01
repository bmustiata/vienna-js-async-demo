const Express = require("express")
const uuid = require("uuid")
import {Model, Event} from '../shared/Model'

const app = new Express()
const ws = require('express-ws')(app);

app.use(Express.static("out/public"))

var index = 0;

let clientSockets = {}

app.ws('/clients', function(ws, req) {
  var clientId = uuid()

  clientSockets[clientId] = ws

  ws.send(JSON.stringify({
    type: Event.NEW_CLIENTS,
    clients: Model.get().clientList
  }));

	ws.on('message', function(msg) {
    msg = JSON.parse(msg);
    console.log("new message: ", msg, Event.REGISTER_CLIENT);
    if (msg.type == Event.REGISTER_CLIENT) {
      console.log("new client registered", clientId);
      ws.send(JSON.stringify({
        type: Event.REGISTERED_ID,
        uid: clientId
      }))

      let newClient = {
        id: clientId,
        label: msg.label,
        x: 0,
        y: 0
      }

      Model.get().addClient(newClient)

      console.log(JSON.stringify(Model.get().clientMap))

      Object.values(clientSockets).forEach(function(clientWs) {
        try {
          clientWs.send(JSON.stringify({
            type: Event.NEW_CLIENTS,
            clients: [newClient]
          }));
        } catch (e) {
        }
      });
    }

    if (msg.type == Event.MOVE_CLIENT) {
      let client = Model.get().clientMap[msg.id]

      if (!client) { // client is not existing anymore, reconnect
        // register client normally
        console.log("client not found: ", msg.id);
        return
      }

      client.x = msg.x
      client.y = msg.y

      // notify the other clients that our guy is out
      Object.values(clientSockets).forEach(function(clientWs) {
        try {
          clientWs.send(JSON.stringify({
            type: Event.REPOSITION_CLIENTS,
            clients: [ client ]
          }));
        } catch (e) {
        }
      });
    }
	});

  ws.on('close', function(msg) {
    console.log('client connection closed for', clientId);
    delete clientSockets[clientId]
    Model.get().removeClient({id: clientId})

    // notify the other clients that our guy is out
    Object.values(clientSockets).forEach(function(clientWs) {
      try {
          clientWs.send(Event.REMOVED_CLIENTS[{id:clientId}])
      } catch (e) {
      }
    });
  });
});

app.listen(3000, () => {
  console.log("listening on 3000");
})

