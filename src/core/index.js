// 从 Vue 的出生文件导入 Vue
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

// 将 Vue 构造函数作为参数，传递给 initGlobalAPI 方法，该方法来自 ./global-api/index.js 文件
//这看上去像是在 Vue 上添加一些全局的API，实际上就是这样的，这些全局API以静态属性和方法的形式被添加到 Vue 构造函数上，打开 src/core/global-api/index.js 文件找到 initGlobalAPI 方法，我们来看看 initGlobalAPI 方法都做了什么。
//initGlobalAPI 方法的全部功能我们就介绍完毕了，它的作用就像它的名字一样，是在 Vue 构造函数上添加全局的API，类似整理 Vue.prototype 上的属性和方法一样，我们同样对 Vue 静态属性和方法做一个整理，将他放到 附录/Vue 构造函数整理-全局API 中，便于以后查阅。
initGlobalAPI(Vue)

// 在 Vue.prototype 上添加 $isServer 属性，该属性代理了来自 core/util/env.js 文件的 isServerRendering 方法
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

// 在 Vue.prototype 上添加 $ssrContext 属性
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
//Vue 构造函数上定义了 FunctionalRenderContext 静态属性，并且 FunctionalRenderContext 属性的值为来自 core/vdom/create-functional-component.js 文件的 FunctionalRenderContext，之所以在 Vue 构造函数上暴露该属性，是为了在 ssr 中使用它。
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

//最后，在 Vue 构造函数上添加了一个静态属性 version，存储了当前 Vue 的版本值，但是这里的 '__VERSION__' 是什么鬼？打开 scripts/config.js 文件，找到 genConfig 方法，其中有这么一句话：__VERSION__: version。这句话被写在了 rollup 的 replace 插件中，也就是说，__VERSION__ 最终将被 version 的值替换，而 version 的值就是 Vue 的版本号。
// Vue.version 存储了当前 Vue 的版本号
Vue.version = '__VERSION__'

// 导出 Vue
//对于 core/index.js 文件的作用我们也大概清楚了，在这个文件里，它首先将核心的 Vue，也就是在 core/instance/index.js 文件中的 Vue，也可以说是原型被包装(添加属性和方法)后的 Vue 导出，然后使用 initGlobalAPI 方法给 Vue 添加静态方法和属性，除此之外，在这里文件里，也对原型进行了修改，为其添加了两个属性：$isServer 和 $ssrContext，最后添加了 Vue.version 属性并导出了 Vue。
export default Vue