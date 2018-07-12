const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)
//所以 web 指向的应该是 src/platforms/web，除了 web 之外，alias.js 文件中还配置了其他的别名，大家在找对应目录的时候，可以来这里查阅，后面就不做这种目录寻找的说明了。
module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  entries: resolve('src/entries'),
  sfc: resolve('src/sfc')
}
