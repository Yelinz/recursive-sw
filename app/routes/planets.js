import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  templateName: "index",

  model({ planets_id }) {
    return this.get("store").findRecord("planets", planets_id)
  }
})
