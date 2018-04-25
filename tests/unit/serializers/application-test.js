import { module, /* test*/ skip } from "qunit"
import { setupTest } from "ember-qunit"
import { run } from "@ember/runloop"

module("Unit | Serializer | application", function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  skip("it exists", function(assert) {
    let store = this.owner.lookup("service:store")
    let serializer = store.serializerFor("application")

    assert.ok(serializer)
  })

  skip("it serializes records", function(assert) {
    let store = this.owner.lookup("service:store")
    let record = run(() => store.createRecord("application", {}))

    let serializedRecord = record.serialize()

    assert.ok(serializedRecord)
  })
})
