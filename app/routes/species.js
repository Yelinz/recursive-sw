import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",

  model({ species_id }) {
    return this.get("store").findRecord("species", species_id)
  }
})
