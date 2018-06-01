import Component from "@ember/component"

export default Component.extend({
  actions: {
    toggleFilter(name) {
      this.get("toggleFilter")(name)
    }
  }
})
