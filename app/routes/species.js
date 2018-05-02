import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  templateName: "index",

  model({ species_id }) {
    return this.get("store").findRecord("species", species_id)
  }
})
