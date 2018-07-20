/* @flow */

import { mergeOptions } from '../util/index'
//initMixin 方法的作用是，在 Vue 上添加 mixin 这个全局API。

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
