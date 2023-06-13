import SvgIcon from '@/components/SvgIcon/index' // svg component

// register globally
function requireAll(requireContext) {
  requireContext.keys().map(requireContext)
}
// require.context
// 一个webpack的api,通过执行require.context函数获取一个特定的上下文,主要用来实现自动化导入模块,在前端工程中,如果遇到从一个文件夹引入很多模块的情况,可以使用这个api,
export function registerSvgIcon(app) {
  const req = require.context('./svg', false, /\.svg$/)
  // 注册svg-icon
  app.component('svg-icon', SvgIcon)
  // eslint-disable-next-line
  requireAll(req)
}
