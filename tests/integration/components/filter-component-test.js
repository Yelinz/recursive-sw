import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { computed } from '@ember/object'
import hbs from 'htmlbars-inline-precompile'
import ENV from 'recursive-sw/config/environment'

module('Integration | Component | filter-component', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('queryParameters', [])
    this.set('filters', computed(() => ENV.APP.filters))

    await render(hbs`{{filter-component
      filterCategories=filters
      queryParameter=queryParameters
      name='people'}} `)

    assert.notEqual(this.element.textContent.trim(), '')
  })
})
