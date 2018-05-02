import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  templateName: "index",

  model({ vehicles_id }) {
    return this.get("store").findRecord("vehicles", vehicles_id)
  }
})
