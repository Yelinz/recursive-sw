import Route from "@ember/routing/route"

export default Route.extend({
  model() {
    return [
      this.get("store").findRecord("people", 1),
      this.get("store").findRecord("films", 1),
      this.get("store").findRecord("starships", 2),
      this.get("store").findRecord("vehicles", 4),
      this.get("store").findRecord("species", 1),
      this.get("store").findRecord("planets", 1)
    ]
  }
})
