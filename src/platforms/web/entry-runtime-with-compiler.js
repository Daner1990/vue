/* @flow */
// 上面代码是简化过的，但是保留了所有重要的部分，该文件的开始是一堆 import 语句，其中重要的两句 import 语句就是上面代码中出现的那两句，一句是导入运行时的 Vue，一句是从 ./compiler/index.js 文件导入 compileToFunctions，并且在倒数第二句代码将其添加到 Vue.compile 上。

// 然后定义了一个函数 idToTemplate，这个函数的作用是：获取拥有指定 id 属性的元素的 innerHTML。

// 之后缓存了运行时Vue的 Vue.prototype.$mount 方法，并且进行了重写。

// 接下来又定义了 getOuterHTML 函数，用来获取一个元素的 outerHTML。

// 这个文件运行下来，对 Vue 的影响有两个，第一个影响是它重写了 Vue.prototype.$mount 方法；第二个影响是添加了 Vue.compile 全局API，目前我们只需要获取这些信息就足够了，我们把这些影响同样更新到 附录 对应的文件中，也都可以查看的到。

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

//
//这个文件并不是 Vue 构造函数的“出生地”，这个文件中的 Vue 是从 ./runtime/index 导入进来的，于是我们就打开当前目录的 runtime 目录下的 index.js 看一下，你同样能够发现这样一句话：

//导入运行中的vue
import Vue from './runtime/index'
import { query } from './util/index'

// 从 ./compiler/index.js 文件导入 compileToFunctions
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

// 根据 id 获取元素的 innerHTML
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 使用 mount 变量缓存 Vue.prototype.$mount 方法
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
/**
 * 获取元素的 outerHTML
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

// 在 Vue 上添加一个全局API `Vue.compile` 其值为上面导入进来的 compileToFunctions
Vue.compile = compileToFunctions

// 导出 Vue
export default Vue
