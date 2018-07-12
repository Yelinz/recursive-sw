import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | category-listing', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('categories', { People: false, Starships: false, Planets: false })

    await render(hbs`{{category-listing categories=categories}}`)
    assert.notEqual(this.element.textContent.trim(), '')
  })
})
