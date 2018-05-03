import Controller from "@ember/controller"
import { computed } from "@ember/object"
import RSVP from "rsvp"

export default Controller.extend({
  results: computed("model", "filtered", function() {
    return this.get("filtered") || this.get("model")
  }),

  actions: {
    search: async function() {
      let searchParam = this.get("search")
      let filtered = await RSVP.hash({
        films: this.get("store").query("films", {
          search: searchParam
        }),
        people: this.get("store").query("people", {
          search: searchParam
        }),
        starships: this.get("store").query("starships", {
          search: searchParam
        }),
        vehicles: this.get("store").query("vehicles", {
          search: searchParam
        }),
        species: this.get("store").query("species", {
          search: searchParam
        }),
        planets: this.get("store").query("planets", {
          search: searchParam
        })
      })
      this.set("filtered", filtered)
    }
  }
})
