/* @flow */
//在看完 runtime/index.js 文件之后，其实 运行时 版本的 Vue 构造函数就已经“成型了”。我们可以打开 entry-runtime.js 这个入口文件，这个文件只有两行代码：
//可以发现，运行时 的入口文件，导出的 Vue 就到 ./runtime/index.js 文件为止。然而我们所选择的并不仅仅是运行时，而是完整版的 Vue，入口文件是 entry-runtime-with-compiler.js，我们知道完整版和运行时版的区别就在于 compiler，所以其实在我们看这个文件的代码之前也能够知道这个文件的作用：就是在运行时的基础上添加 compiler，对没错，这个文件就是干这个的，接下来我们就看看它是怎么做的，打开 entry-runtime-with-compiler.js 文件：
import Vue from './runtime/index'

export default Vue
