import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  queryParams: {
    search: {
      refreshModel: true
    }
  },

  model(params) {
    let queryDict = {}
    if (params.search !== "") {
      if (this.controllerFor("search").get("checkboxes.people")) {
        queryDict.people = this.get("store").query("people", params)
      }
      if (this.controllerFor("search").get("checkboxes.films")) {
        queryDict.films = this.get("store").query("films", params)
      }
      if (this.controllerFor("search").get("checkboxes.starships")) {
        queryDict.starships = this.get("store").query("starships", params)
      }
      if (this.controllerFor("search").get("checkboxes.vehicles")) {
        queryDict.vehicles = this.get("store").query("vehicles", params)
      }
      if (this.controllerFor("search").get("checkboxes.species")) {
        queryDict.species = this.get("store").query("species", params)
      }
      if (this.controllerFor("search").get("checkboxes.planets")) {
        queryDict.planets = this.get("store").query("planets", params)
      }
    }
    return RSVP.hash(queryDict)
  }
})
