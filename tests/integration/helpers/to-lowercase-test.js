import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Helper | to-lowercase', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('inputValue', 'UPPER')

    await render(hbs`{{to-lowercase inputValue}}`)

    assert.equal(this.element.textContent.trim(), 'upper')
  })
})
