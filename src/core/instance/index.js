//可以看到，这个文件才是 Vue 构造函数真正的“出生地”，上面的代码是 ./instance/index.js 文件中全部的代码，还是比较简短易看的，首先分别从 ./init.js、./state.js、./render.js、./events.js、./lifecycle.js 这五个文件中导入五个方法，分别是：initMixin、stateMixin、renderMixin、eventsMixin 以及 lifecycleMixin，然后定义了 Vue 构造函数，其中使用了安全模式来提醒你要使用 new 操作符来调用 Vue，接着将 Vue 构造函数作为参数，分别传递给了导入进来的这五个方法，最后导出 Vue。

import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'


// 定义 Vue 构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  //在 Vue 的构造函数里有这么一句：this._init(options)，这说明，当我们执行 new Vue() 的时候，this._init(options) 将被执行。
  this._init(options)
}


// 将 Vue 作为参数传递给导入的五个方法

//在 Vue 的原型上添加了 _init 方法，这个 _init 方法看上去应该是内部初始化的一个方法，其实在 instance/index.js 文件中我们是见过这个方法的
//在 Vue 的构造函数里有这么一句：this._init(options)，这说明，当我们执行 new Vue() 的时候，this._init(options) 将被执行
initMixin(Vue)

//使用 Object.defineProperty 在 Vue.prototype 上定义了两个属性，就是大家熟悉的：$data 和 $props，这两个属性的定义分别写在了 dataDef 以及 propsDef 这两个对象里
stateMixin(Vue)

//在这个文件添加了on once off emit四个方法
eventsMixin(Vue)

//添加了 _update $forceUpdate $destroy三个方法
lifecycleMixin(Vue)

//以 Vue.prototype 为参数调用了 installRenderHelpers 函数，这个函数来自于与 render.js 文件相同目录下的 render-helpers/index.js 文件，打开这个文件找到 installRenderHelpers 函数
//renderMixin 方法在执行完 installRenderHelpers 函数之后，又在 Vue.prototype 上添加了两个方法，分别是：$nextTick 和 _render
renderMixin(Vue)

//我们大概清楚每个 *Mixin 方法的作用其实就是包装 Vue.prototype，在其上挂载一些属性和方法，下面我们要做一件很重要的事情，就是将上面的内容集中合并起来，放到一个单独的地方，便于以后查看，我将它们整理到了这里：附录/Vue 构造函数整理-原型，这样当我们在后面详细讲解的时候，提到某个方法你就可以迅速定位它的位置，便于我们思路的清晰
// 导出 Vue
export default Vue
