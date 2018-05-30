import Controller from "@ember/controller"
import { computed } from "@ember/object"

export default Controller.extend({
  queryParams: ["search"],
  search: "",
  init() {
    this._super(...arguments)
    this.set("checkboxes", {})
    this.set("checkboxes.people", true)
  }
})
