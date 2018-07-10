import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import ENV from 'recursive-sw/config/environment'

module('Integration | Component | filter-component', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('queryParameters', [])
    this.set('filters', ENV.APP.filters.people)

    await render(
      hbs`{{filter-component filterCategorys=filters queryParameter=queryParameters}} `
    )

    assert.notEqual(this.element.textContent.trim(), '')
  })
})
