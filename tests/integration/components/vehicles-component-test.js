import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | vehicles-component', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{vehicles-component}}`)

    assert.equal(this.element.textContent.trim(), 'No Vehicles')

    // Template block usage:
    await render(hbs`
      {{#vehicles-component}}
        template block text
      {{/vehicles-component}}
    `)

    assert.equal(this.element.textContent.trim(), 'No Vehicles')
  })
})
