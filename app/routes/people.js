import Route from "@ember/routing/route"

export default Route.extend({
  templateName: "index",

  model({ people_id }) {
    return this.get("store").findRecord("people", people_id)
  }
})
