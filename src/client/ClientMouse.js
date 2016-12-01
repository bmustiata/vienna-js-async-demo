
export function register(Vue) {
  Vue.component('client-mouse', {
    template: require("./ClientMouse.html"),
    props: {
      currentId: String,
      client: Object
    },
    computed: {
      isCurrentClientMouse: function() {
        return this.currentId == this.client.id ? 'current-client-mouse' : '';
      }
    }
  });
}

