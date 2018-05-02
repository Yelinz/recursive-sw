import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  templateName: "index",

  model({ people_id }) {
    return this.get("store").findRecord("people", people_id)
  }
})
