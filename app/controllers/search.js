import Controller from "@ember/controller"
import { debounce } from "@ember/runloop"

export default Controller.extend({
  queryParams: ["search"],
  search: "",
  init() {
    this._super(...arguments)
    this.set("checkboxes", {})
    this.set("checkboxes.people", true)
  },
  setSearch(value) {
    this.set("search", value)
  },
  actions: {
    handleSearch(value) {
      debounce(this, this.setSearch, value, 500)
    }
  }
})
