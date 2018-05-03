import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",

  model({ films_id }) {
    return this.get("store").findRecord("films", films_id)
  }
})
