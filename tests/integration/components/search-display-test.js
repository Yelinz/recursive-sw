import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | search-display', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    await render(hbs`{{search-display}}`)
    assert.equal(this.element.textContent.trim(), '')
  })
})
