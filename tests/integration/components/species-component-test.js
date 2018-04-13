import { module, /* test*/ skip } from "qunit"
import { setupRenderingTest } from "ember-qunit"
import { render } from "@ember/test-helpers"
import hbs from "htmlbars-inline-precompile"

module("Integration | Component | species-component", function(hooks) {
  setupRenderingTest(hooks)

  skip("it renders", async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{species-component}}`)

    assert.equal(this.element.textContent.trim(), "")

    // Template block usage:
    await render(hbs`
      {{#species-component}}
        template block text
      {{/species-component}}
    `)

    assert.equal(this.element.textContent.trim(), "")
  })
})
