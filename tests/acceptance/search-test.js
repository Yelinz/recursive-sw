import { module, test } from 'qunit'
import { visit, currentURL, fillIn, click } from '@ember/test-helpers'
import { setupApplicationTest } from 'ember-qunit'

module('Acceptance | search', function(hooks) {
  setupApplicationTest(hooks)

  test('search', async function(assert) {
    await visit('/search')
    assert.equal(currentURL(), '/search')
    assert.dom('[data-test-category="People"]').isChecked()
    assert.dom('[data-test-category="Vehicles"]').isNotChecked()
    assert.dom('[placeholder="Search"]').hasNoValue()
    assert.dom('[data-test-filter-people]').exists()
    assert.dom('[data-test-filter-vehicles]').doesNotExist()

    // Add Vehicles category and remove People category
    await click('[data-test-category="People"]')
    await click('[data-test-category="Vehicles"]')
    assert.equal(currentURL(), '/search?people=false&vehicles=true')
    assert.dom('[data-test-category="People"]').isNotChecked()
    assert.dom('[data-test-category="Vehicles"]').isChecked()
    assert.dom('[data-test-filter-people]').doesNotExist()
    assert.dom('[data-test-filter-vehicles]').exists()

    // Search for sk
    await fillIn('[placeholder="Search"]', 'sk')
    assert.equal(currentURL(), '/search?people=false&search=sk&vehicles=true')
    assert.dom('[placeholder="Search"]').hasValue('sk')
    assert.dom('[data-test-search-display-people]').doesNotExist()
    assert.dom('[data-test-header-vehicle="0"]').hasText('T-16 skyhopper')
    assert.dom('[data-test-header-vehicle="2"]').doesNotExist()

    // Add People category
    await click('[data-test-category="People"]')
    assert.equal(currentURL(), '/search?search=sk&vehicles=true')
    assert.dom('[data-test-filter-people]').exists()
    assert.dom('[data-test-header-people="0"]').hasText('Luke Skywalker')
    assert.dom('[data-test-header-people="1"]').hasText('Anakin Skywalker')
    assert.dom('[data-test-header-people="2"]').hasText('Bossk')
    assert.dom('[data-test-header-people="3"]').hasText('Shmi Skywalker')
    assert.dom('[data-test-header-people="4"]').doesNotExist()

    // Add people filter Female
    await click('[data-test-filter-checkbox="Female"]')
    assert.equal(
      currentURL(),
      '/search?search=sk&selectedFilters=%5B%22Female%22%5D&vehicles=true'
    )
    assert.dom('[data-test-filter-checkbox="Female"]').isChecked()
    assert.dom('[data-test-header-people="0"]').hasText('Shmi Skywalker')
    assert.dom('[data-test-header-people="1"]').doesNotExist()

    // Add people filter Male
    await click('[data-test-filter-checkbox="Male"]')
    assert.equal(
      currentURL(),
      '/search?search=sk&selectedFilters=%5B%22Female%22%2C%22Male%22%5D&vehicles=true'
    )
    assert.dom('[data-test-filter-checkbox="Male"]').isChecked()
    assert.dom('[data-test-header-people="0"]').hasText('Shmi Skywalker')
    assert.dom('[data-test-header-people="1"]').hasText('Luke Skywalker')
    assert.dom('[data-test-header-people="2"]').hasText('Anakin Skywalker')
    assert.dom('[data-test-header-people="3"]').hasText('Bossk')
    assert.dom('[data-test-header-people="4"]').doesNotExist()

    // Add numeric people filter Height of greater than 180
    await fillIn('[data-test-filter-number="Height"]', 180)
    assert.equal(
      currentURL(),
      '/search?search=sk&selectedFilters=%5B%22Female%22%2C%22Male%22%2C%5B%22height%22%2C%22gt%22%2C%22180%22%5D%5D&vehicles=true'
    )
    assert.dom('[data-test-filter-number="Height"]').hasValue('180')
    assert.dom('[data-test-header-people="0"]').hasText('Anakin Skywalker')
    assert.dom('[data-test-header-people="1"]').hasText('Bossk')
    assert.dom('[data-test-header-people="2"]').doesNotExist()

    // Add numeric people filter Mass of less than 90
    await fillIn('[data-test-filter-number="Mass"]', 90)
    await fillIn('[data-test-filter-number-select="Mass"]', 'Mass-lt')
    assert.equal(
      currentURL(),
      '/search?search=sk&selectedFilters=%5B%22Female%22%2C%22Male%22%2C%5B%22height%22%2C%22gt%22%2C%22180%22%5D%2C%5B%22mass%22%2C%22lt%22%2C%2290%22%5D%5D&vehicles=true'
    )
    assert.dom('[data-test-filter-number="Mass"]').hasValue('90')
    assert.dom('[data-test-filter-number-select="Mass"]').hasValue('Mass-lt')
    assert.dom('[data-test-header-people="0"]').hasText('Anakin Skywalker')
    assert.dom('[data-test-header-people="1"]').doesNotExist()

    // Add vehicles filter Wheeled
    await click('[data-test-filter-checkbox="Wheeled"]')
    assert.equal(
      currentURL(),
      '/search?search=sk&selectedFilters=%5B%22Female%22%2C%22Male%22%2C%5B%22height%22%2C%22gt%22%2C%22180%22%5D%2C%5B%22mass%22%2C%22lt%22%2C%2290%22%5D%2C%22Wheeled%22%5D&vehicles=true'
    )
    assert.dom('[data-test-filter-checkbox="Wheeled"]').isChecked()
    assert.dom('[data-test-header-vehicle="0"]').doesNotExist()
  })

  test('search queryparams', async function(assert) {
    // Visit url to assert automatic fillin of the values defined in the queryparams
    await visit(
      '/search?search=ti&selectedFilters=%5B%22Hermaphrodite%22%2C%22Female%22%2C%22Starfighter%22%2C%5B%22length%22%2C%22gt%22%2C%226%22%5D%2C%5B%22crew%22%2C%22eq%22%2C%221%22%5D%2C%5B%22height%22%2C%22gt%22%2C%22170%22%5D%2C%5B%22mass%22%2C%22lt%22%2C%2260%22%5D%5D&starships=true'
    )
    assert.equal(
      currentURL(),
      '/search?search=ti&selectedFilters=%5B%22Hermaphrodite%22%2C%22Female%22%2C%22Starfighter%22%2C%5B%22length%22%2C%22gt%22%2C%226%22%5D%2C%5B%22crew%22%2C%22eq%22%2C%221%22%5D%2C%5B%22height%22%2C%22gt%22%2C%22170%22%5D%2C%5B%22mass%22%2C%22lt%22%2C%2260%22%5D%5D&starships=true'
    )
    assert.dom('[data-test-category="People"]').isChecked()
    assert.dom('[data-test-category="Starships"]').isChecked()
    assert.dom('[data-test-category="Vehicles"]').isNotChecked()
    assert.dom('[placeholder="Search"]').hasValue('ti')
    assert.dom('[data-test-filter-checkbox="Female"]').isChecked()
    assert.dom('[data-test-filter-checkbox="Hermaphrodite"]').isChecked()
    assert.dom('[data-test-filter-checkbox="Starfighter"]').isChecked()
    assert.dom('[data-test-filter-number="Height"]').hasValue('170')
    assert.dom('[data-test-filter-number="Mass"]').hasValue('60')
    assert.dom('[data-test-filter-number-select="Mass"]').hasValue('Mass-lt')
    assert.dom('[data-test-filter-number="Crew"]').hasValue('1')
    assert.dom('[data-test-filter-number="Length"]').hasValue('6')
    assert.dom('[data-test-filter-number-select="Crew"]').hasValue('Crew-eq')
    assert.dom('[data-test-header-people="0"]').hasText('Shaak Ti')
    assert.dom('[data-test-header-people="1"]').doesNotExist()
    assert.dom('[data-test-header-starships="0"]').hasText('TIE Advanced x1')
    assert.dom('[data-test-header-starships="1"]').doesNotExist()
  })
})
