export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/sample/list' },
      //sample
      {
        path: '/sample',
        name: 'sample',
        icon: 'tag',
        routes: [
          {
            path: '/sample/list',
            name: 'list',
            component: './Sample/SampleList',
            authority: ['Admin', 'Quản lý', 'Cộng tác viên'],
          },
          {
            path: '/sample/:id/detail',
            name: 'detail',
            component: './Sample/SampleDetail',
            authority: ['Admin', 'Quản lý', 'Cộng tác viên'],
            hideInMenu: true,
          },
          {
            path: '/sample/:id/edit',
            name: 'edit',
            component: './Sample/SampleEdit',
            hideInMenu: true,
            authority: ['Admin', 'Quản lý'],
          },
          {
            path: '/sample/registration',
            name: 'registration',
            component: './Sample/SampleRegistration',
            authority: ['Admin', 'Quản lý'],
          }
        ]
      },
      //production
      {
        path: '/production',
        name: 'production',
        icon: 'tags',
        authority: ['Admin', 'Cộng tác viên'],
        routes: [
          {
            path: '/production/list',
            name: 'list',
            component: './Production/List',
            authority: ['Admin', 'Cộng tác viên'],
          },
          {
            path: '/production/:id/detail',
            name: 'detail',
            component: './Production/Detail',
            authority: ['Admin', 'Cộng tác viên'],
            hideInMenu: true,
          },
          {
            path: '/production/registration',
            name: 'registration',
            component: './Production/Registration',
            authority: ['Admin', 'Cộng tác viên'],
          },
          {
            path: '/production/:id/edit',
            name: 'edit',
            component: './Production/Edit',
            hideInMenu: true,
            authority: ['Admin', 'Cộng tác viên'],
          },
        ]
      },
      //user
      {
        path: '/users',
        name: 'users',
        icon: 'user',
        // hideInMenu: true,
        authority: ['Admin', 'Quản lý'],
        routes: [
          // {
          //   path: '/customer/list',
          //   name: 'list',
          //   component: './Customer/List',
          // },
          {
            path: '/users/registration',
            name: 'registration',
            component: './User/UserRegistration',
          }
        ]
      },
      {
        name: 'account',
        icon: 'setting',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
