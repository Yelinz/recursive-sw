import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",
  controllerName: "index",

  model({ species_id }) {
    return this.get("store").findRecord("species", species_id)
  }
})
