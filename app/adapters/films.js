import ApplicationAdapter from "./application"

export default ApplicationAdapter.extend({
  urlForFindHasMany(id, modelName, snapshot) {
    console.log("here")
    console.log("id", id)
    console.log("modelName", modelName)
    console.log("snapshot", snapshot)
    return "people/1/"
  }
})
