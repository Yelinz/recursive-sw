import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Helper | neq', function(hooks) {
  setupRenderingTest(hooks)

  test('not equal', async function(assert) {
    this.set('inputValue', '1234')

    await render(hbs`{{neq inputValue 'a'}}`)

    assert.equal(this.element.textContent.trim(), 'true')
  })
})
