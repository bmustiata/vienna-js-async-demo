
export var Event = {
    NEW_CLIENTS: "new-clients",
    REMOVED_CLIENTS: "removed-clients",
    REGISTER_CLIENT: "register-client",
    REGISTERED_ID: 'registered-id',
    MOVE_CLIENT: 'move-client',
    REPOSITION_CLIENTS: "reposition-clients"
}

export class Mice {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.label = "A";
    this.id = null;
  }
}

export class Model {
  constructor() {
    this.clientList = []
    this.clientMap = {}
  }

  addClient(client) {
    if (this.clientMap[client.id]) {
      this.removeClient(client);
    }

    this.clientList.push(client)
    this.clientMap[client.id] = client
  }

  removeClient(client) {
    for (var i = 0; i < this.clientList.length; i++) {
      var item = this.clientList[i];
      if (item.id == client.id) {
        this.clientList.splice(i, 1);
      }
    }
    delete this.clientMap[client.id];
  }

  static get() {
    return Model.INSTANCE
  }
}

Model.INSTANCE = new Model()

if (typeof window != "undefined") {
    window["Model"] = Model
}
