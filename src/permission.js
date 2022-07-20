import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
// vip 白名单 默认所有人是坏人，这几个是好人
const whiteList = ['/login', '/404']
// 前置路由
router.beforeEach((to, from, next) => {
  // 开启进度效果
  NProgress.start()
  // 权限控制
  const token = store.state.user.token
  if (token) {
    // 如果登录过，就不能再去登录了，直接让去后台首页
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        // 当用户手里面有token并且访问的不是登录页面，那就应该请求个人资料
        store.dispatch('user/getInfo')
      }
      next()// 放行
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由
router.afterEach(() => {
  // 结束进度效果
  NProgress.done()
})
