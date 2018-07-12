//可以看到，这个文件才是 Vue 构造函数真正的“出生地”，上面的代码是 ./instance/index.js 文件中全部的代码，还是比较简短易看的，首先分别从 ./init.js、./state.js、./render.js、./events.js、./lifecycle.js 这五个文件中导入五个方法，分别是：initMixin、stateMixin、renderMixin、eventsMixin 以及 lifecycleMixin，然后定义了 Vue 构造函数，其中使用了安全模式来提醒你要使用 new 操作符来调用 Vue，接着将 Vue 构造函数作为参数，分别传递给了导入进来的这五个方法，最后导出 Vue。

import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
