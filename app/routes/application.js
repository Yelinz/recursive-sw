import Route from "@ember/routing/route"

export default Route.extend({
  actions: {
    search: function() {
      let searchParam = this.get("controller").get("search")
      this.transitionTo("search", { queryParams: { search: searchParam } })
    }
  }
})
