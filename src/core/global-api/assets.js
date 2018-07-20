/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'
//ASSET_TYPES 我们已经见过了，它在 shared/constants.js 文件中，长成这样：
// export const ASSET_TYPES = [
//   'component',
//   'directive',
//   'filter'
// ]
// 所以，最终经过 initAssetRegisters 方法，Vue 将又多了三个静态方法：

// Vue.component
// Vue.directive
// Vue.filter
//这三个静态方法大家都不陌生，分别用来全局注册组件，指令和过滤器。

//这样，initGlobalAPI 方法的全部功能我们就介绍完毕了，它的作用就像它的名字一样，是在 Vue 构造函数上添加全局的API，类似整理 Vue.prototype 上的属性和方法一样，我们同样对 Vue 静态属性和方法做一个整理，将他放到 附录/Vue 构造函数整理-全局API 中，便于以后查阅。

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
