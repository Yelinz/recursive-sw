import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",

  model({ vehicles_id }) {
    return this.get("store").findRecord("vehicles", vehicles_id)
  }
})
