const Model = require("../shared/Model").Model

/**
 * register - Register the client-mice-container
 * @param {} Vue
 * @return {void}
 */
export function register(Vue) {
  Vue.component('client-mice-container', {
    template: require('./ClientMiceContainer.html'),
    props: {
      currentId: String
    },
    data: function() {
      return {
        clientList : Model.get().clientList
      }
    }
  });
}

