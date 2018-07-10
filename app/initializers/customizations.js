import Checkbox from '@ember/component/checkbox'

export default {
  initialize: function() {
    Checkbox.reopen({
      attributeBindings: ['data-test-category']
    })
  }
}
