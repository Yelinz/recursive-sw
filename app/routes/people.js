import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"
import { later } from "@ember/runloop"

export default Route.extend({
  request_data: service(),
  templateName: "index",

  model(params) {
    let thisModel = this
    return new RSVP.Promise(function(resolve) {
      let returnArr = []
      thisModel
        .get("request_data")
        .returnUrls(params)
        .then(function(urls) {
          urls.forEach(element => {
            returnArr.push(
              thisModel.get("store").findRecord(element[0], element[1])
            )
          })
        })
      later(function() {
        resolve(returnArr)
      }, 3000)
    })
  }
})
