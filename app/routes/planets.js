import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",
  controllerName: "index",

  model({ planets_id }) {
    return this.get("store").findRecord("planets", planets_id)
  }
})
