/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

//initGlobalAPI 方法的全部功能我们就介绍完毕了，它的作用就像它的名字一样，是在 Vue 构造函数上添加全局的API，类似整理 Vue.prototype 上的属性和方法一样，我们同样对 Vue 静态属性和方法做一个整理，将他放到 附录/Vue 构造函数整理-全局API 中，便于以后查阅。
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  //这段代码的作用是在 Vue 构造函数上添加 config 属性，这个属性的添加方式类似我们前面看过的 $data 以及 $props，也是一个只读的属性，并且当你试图设置其值时，在非生产环境下会给你一个友好的提示。
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  //在 Vue 上添加了 util 属性，这是一个对象，这个对象拥有四个属性分别是：warn、extend、mergeOptions 以及 defineReactive。这四个属性来自于 core/util/index.js 文件。

//这里有一段注释，大概意思是 Vue.util 以及 util 下的四个方法都不被认为是公共API的一部分，要避免依赖他们，但是你依然可以使用，只不过风险你要自己控制。并且，在官方文档上也并没有介绍这个全局API，所以能不用尽量不要用。
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

    //这段代码比较简单，在 Vue 上添加了四个属性分别是 set、delete、nextTick 以及 options，这里要注意的是 Vue.options，现在它还只是一个空的对象，通过 Object.create(null) 创建。
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)

  //不过接下来，Vue.options 就不是一个空的对象了，因为下面这段代码：
  //上面的代码中，ASSET_TYPES 来自于 shared/constants.js 文件，打开这个文件，发现 ASSET_TYPES 是一个数组：
  // export const ASSET_TYPES = [
  //   'component',
  //   'directive',
  //   'filter'
  // ]
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

//   Vue.options 将变成这样：

// Vue.options = {
// 	components: Object.create(null),
// 	directives: Object.create(null),
// 	filters: Object.create(null),
// 	_base: Vue
// }

  //extend 来自于 shared/util.js 文件，可以在 附录/shared/util.js 文件工具方法全解 中查看其作用，总之这句话的意思就是将 builtInComponents 的属性混合到 Vue.options.components 中，其中 builtInComponents 来自于 core/components/index.js 
  extend(Vue.options.components, builtInComponents)
  // Vue.options.components = {
  //   KeepAlive
  // }
//最终：：：
  // Vue.options = {
  //   components: {
  //     KeepAlive
  //   },
  //   directives: Object.create(null),
  //   filters: Object.create(null),
  //   _base: Vue
  // }

  // 这四个方法从上至下分别来自于 global-api/use.js、global-api/mixin.js、global-api/extend.js 以及 global-api/assets.js 这四个文件

  //vue.use
  initUse(Vue)

  // Vue.mixin
  initMixin(Vue)

  //Vue.extend
  //initExtend 方法在 Vue 上添加了 Vue.cid 静态属性，和 Vue.extend 静态方法。
  initExtend(Vue)

//Vue.component
// Vue.directive
// Vue.filter
//这三个静态方法大家都不陌生，分别用来全局注册组件，指令和过滤器。
  initAssetRegisters(Vue)
}
