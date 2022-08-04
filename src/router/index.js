import { createRouter, createWebHashHistory } from 'vue-router';

export const asyncRouterMap = [
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
        component: () => import('../views/home/index.vue')
      },
      // {
      //   path: '/user',
      //   name: 'user',
      //   meta: {
      //     title: '个人中心'
      //   },
      //   component: () => import('@/views/User.vue')
      // }
    ]
  },
  {
    path: '/user/list',
    meta: { title: '用户管理', role: '用户管理', icon: 'UserFilled' },
    component: () => import('@/views/Layout/index.vue'),
    children: [
      {
        path: '/user/list',
        name: 'user_list',
        meta: {
          title: '用户列表'
        },
        component: () => import('../views/UserManage/List.vue')
      },
      {
        path: '/user/detail',
        name: 'user_detail',
        meta: {
          title: '用户详情',
          hidden: true
        },
        component: () => import('../views/UserManage/Detail.vue')
      },
      {
        path: '/user/email',
        name: 'user_email',
        meta: {
          title: '邮箱验证码'
        },
        component: () => import('../views/UserManage/Email.vue')
      },
      {
        path: '/user/phone',
        name: 'user_phone',
        meta: {
          title: '手机验证码'
        },
        component: () => import('../views/UserManage/Phone.vue')
      },
    ]
  },
  {
    path: '/funds/recharge',
    meta: { title: '数据中心', role: '数据中心', icon: 'Money' },
    component: () => import('@/views/Layout/index.vue'),
    children: [
      {
        path: '/funds/recharge',
        name: 'funds_recharge',
        meta: {
          title: '充值列表'
        },
        component: () => import('../views/FundsManage/Recharge.vue')
      },
      {
        path: '/funds/u_withdraw',
        name: 'funds_u_withdraw',
        meta: {
          title: 'U币提现记录'
        },
        component: () => import('../views/FundsManage/UsdtWithdraw.vue')
      },
      {
        path: '/funds/fiat_withdraw',
        name: 'fiat_withdraw',
        meta: {
          title: '法币提现记录'
        },
        component: () => import('../views/FundsManage/FiatWithdraw.vue')
      },
      {
        path: '/funds/bill',
        name: 'funds_bill',
        meta: {
          title: '用户账单记录'
        },
        component: () => import('../views/FundsManage/BillRecord.vue')
      },
      {
        path: '/funds/transfer',
        name: 'transfer',
        meta: {
          title: '转账记录'
        },
        component: () => import('../views/FundsManage/Transfer.vue')
      },
      {
        path: '/funds/express_xchange',
        name: 'express_xchange',
        meta: {
          title: '平台闪兑记录'
        },
        component: () => import('../views/FundsManage/ExpressExchange.vue')
      },
    ]
  },
  {
    path: '/risk/config',
    meta: { title: '风控管理', role: '风控管理', icon: 'Management' },
    component: () => import('@/views/Layout/index.vue'),
    children: [
      {
        path: '/risk/config',
        name: 'risk_config',
        meta: {
          title: '风控配置'
        },
        component: () => import('../views/RiskManage/Risk.vue')
      },
      {
        path: '/risk/recycle',
        name: 'risk_recycle',
        meta: {
          title: '归集管理'
        },
        component: () => import('../views/RiskManage/Recycle.vue')
      },
    ]
  },

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
  },
  {
    path: '/',
    redirect: '/home'
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap.concat(asyncRouterMap)
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const role = localStorage.getItem('ms_username');
  const xToken = localStorage.getItem('token')
  console.log(!xToken)
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
