import { createRouter, createWebHashHistory } from 'vue-router';

export const asyncRouterMap = [
//   {
//     path: '/',
//     redirect: '/dashboard'
//   },
  // {
  //     path: "/index",
  //     meta: { title: "首页", role: "首页", icon: "el-icon-home" },
  //     component: () => import("@/pages/Layout" /* webpackChunkName: 'account' */), // 账号模块
  //     children: [
  //       {
  //         path: "index",
  //         name: "index",
  //         meta: { title: "首页", role: "首页", noCache: true },
  //         component: () => import("@/pages/index" /* webpackChunkName: 'index' */) // 启动页
  //       }
  //     ]
  //   },
  {
    path: '/',
    name: 'Home',
    meta: { title: '首页', role: '首页', icon: 'HomeFilled' },
    component: () => import('@/views/Layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '系统首页'
        },
        component: () =>
          import('../views/home/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '个人中心'
        },
        component: () =>
          import('@/views/User.vue')
      }
    ]
  }
];

export const constantRouterMap = [
    {
        path: '/login',
        name: 'Login',
        meta: {
          title: '登录'
        },
        component: () =>
          import(/* webpackChunkName: "login" */ '../views/Login.vue')
      },
      {
        path: '/404',
        name: '404',
        meta: {
          title: '找不到页面'
        },
        component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
      },
      {
        path: '/403',
        name: '403',
        meta: {
          title: '没有权限'
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue')
      }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes :constantRouterMap.concat(asyncRouterMap)
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const role = localStorage.getItem('ms_username');
  if (!role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403');
  } else {
    next();
  }
});

export default router;
