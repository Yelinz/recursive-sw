import EmberRouter from "@ember/routing/router"
import config from "./config/environment"

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function() {
  this.route("people", { path: "/people/:people_id" })
  this.route("films", { path: "/films/:films_id" })
  this.route("planets", { path: "/planets/:planets_id" })
  this.route("species", { path: "/species/:species_id" })
  this.route("starships", { path: "/starships/:starships_id" })
  this.route("vehicles", { path: "/vehicles/:vehicles_id" })
  this.route('search');
})

export default Router
