import { helper } from "@ember/component/helper"

export function toLowercase([string]) {
  return String(string)
    .toLowerCase()
    .trim()
}

export default helper(toLowercase)
