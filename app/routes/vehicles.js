import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",
  controllerName: "index",

  model({ vehicles_id }) {
    return this.get("store").findRecord("vehicles", vehicles_id)
  }
})
