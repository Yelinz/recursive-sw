import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend({
  templateName: "index",

  model({ starships_id }) {
    return this.get("store").findRecord("starships", starships_id)
  }
})
