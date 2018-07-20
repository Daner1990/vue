/* @flow */

//现在，在我们弄清 Vue 构造函数的过程中已经看了两个主要的文件，分别是：core/instance/index.js 文件以及 core/index.js 文件，
//前者是 Vue 构造函数的定义文件，我们一直都叫其 Vue 的出生文件，主要作用是定义 Vue 构造函数，并对其原型添加属性和方法，即实例属性和实例方法。
//后者的主要作用是，为 Vue 添加全局的API，也就是静态的方法和属性。这两个文件有个共同点，就是它们都在 core 目录下，我们在介绍 Vue 项目目录结构的时候说过：core 目录存放的是平台无关的代码，所以无论是 core/instance/index.js 文件还是 core/index.js 文件，它们都在包装核心的 Vue，且这些包装是平台无关的。
//但是，Vue 是一个 Multi-platform 的项目（web和weex），不同平台可能会内置不同的组件、指令，或者一些平台特有的功能等等，那么这就需要对 Vue 根据不同的平台进行平台化的包装，这就是接下来我们要看的文件，这个文件也出现在我们寻找 Vue 构造函数的路线上，他就是：platforms/web/runtime/index.js 文件。
import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser, isChrome } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'


//其实这就是在覆盖默认导出的 config 对象的属性，注释已经写得很清楚了，安装平台特定的工具方法，至于这些东西的作用这里我们暂且不说，你只要知道它在干嘛即可。
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
//安装特定平台运行时的指令和组件
//其作用是在 Vue.options 上添加 web 平台运行时的特定组件和指令。
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)
// Vue.options = {
// 	components: {
// 		KeepAlive,
// 		Transition,
// 		TransitionGroup
// 	},
// 	directives: {
// 		model,
// 		show
// 	},
// 	filters: Object.create(null),
// 	_base: Vue
// }

// install platform patch function
//首先在 Vue.prototype 上添加 __patch__ 方法，如果在浏览器环境运行的话，这个方法的值为 patch 函数，否则是一个空函数 noop。然后又在 Vue.prototype 上添加了 $mount 方法，我们暂且不关心 $mount 方法的内容和作用。
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
//再往下的一段代码是 vue-devtools 的全局钩子，它被包裹在 setTimeout 中，最后导出了 Vue。
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

// /现在我们就看完了 platforms/web/runtime/index.js 文件，该文件的作用是对 Vue 进行平台化的包装：

// 设置平台化的 Vue.config。
// 在 Vue.options 上混合了两个指令(directives)，分别是 model 和 show。
// 在 Vue.options 上混合了两个组件(components)，分别是 Transition 和 TransitionGroup。
// 在 Vue.prototype 上添加了两个方法：__patch__ 和 $mount。
// 在经过这个文件之后，Vue.options 以及 Vue.config 和 Vue.prototype 都有所变化，我们把这些变化更新到对应的 附录 文件里，都可以查看的到。
export default Vue
