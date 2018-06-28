import {
  helper
} from '@ember/component/helper';

export function inArray(params) {
  return params[0].some(name => name === params[1])
}

export default helper(inArray);
