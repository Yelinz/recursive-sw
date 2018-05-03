import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",

  model({ planets_id }) {
    return this.get("store").findRecord("planets", planets_id)
  }
})
