import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  templateName: "index",
  controllerName: "index",

  model(params) {
    return RSVP.hash({
      people: this.get("store").query("people", { search: params.search }),
      films: this.get("store").query("films", { search: params.search }),
      starships: this.get("store").query("starships", {
        search: params.search
      }),
      vehicles: this.get("store").query("vehicles", { search: params.search }),
      species: this.get("store").query("species", { search: params.search }),
      planets: this.get("store").query("planets", { search: params.search })
    })
  }
})
