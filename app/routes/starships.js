import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",
  controllerName: "index",

  model({ starships_id }) {
    return this.get("store").findRecord("starships", starships_id)
  }
})
