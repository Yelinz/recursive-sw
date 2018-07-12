import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Helper | eq', function(hooks) {
  setupRenderingTest(hooks)

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    await render(hbs`{{eq 'a' 'a'}}`)
    assert.equal(this.element.textContent.trim(), 'true')
    await render(hbs`{{eq 'a' 'b'}}`)
    assert.equal(this.element.textContent.trim(), 'false')
    await render(hbs`{{eq 1 '1'}}`)
    assert.equal(this.element.textContent.trim(), 'false')
  })
})
