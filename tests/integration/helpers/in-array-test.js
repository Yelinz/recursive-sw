import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Helper | in-array', function(hooks) {
  setupRenderingTest(hooks)

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', ['a', 'b', 'c'])

    await render(hbs`{{in-array inputValue 'a'}}`)
    assert.equal(this.element.textContent.trim(), 'true')
    await render(hbs`{{in-array inputValue 'd'}}`)
    assert.equal(this.element.textContent.trim(), 'false')
  })
})
