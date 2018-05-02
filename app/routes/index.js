import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  model() {
    return RSVP.hash({
      films: [this.get("store").findRecord("films", 1)],
      people: [this.get("store").findRecord("people", 1)],
      starships: [this.get("store").findRecord("starships", 2)],
      vehicles: [this.get("store").findRecord("vehicles", 4)],
      species: [this.get("store").findRecord("species", 1)],
      planets: [this.get("store").findRecord("planets", 1)]
    })
  }
})
