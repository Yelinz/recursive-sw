import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | planets-component', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{planets-component}}`)

    assert.equal(this.element.textContent.trim(), 'No Planets')

    // Template block usage:
    await render(hbs`
      {{#planets-component}}
        template block text
      {{/planets-component}}
    `)

    assert.equal(this.element.textContent.trim(), 'No Planets')
  })
})
