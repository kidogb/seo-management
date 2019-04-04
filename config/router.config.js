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
      { path: '/', redirect: '/production/list' },
      //production
      {
        path: '/production',
        name: 'production',
        icon: 'plus-square',
        routes: [
          {
            path: '/production/list',
            name: 'list',
            component: './Production/List',
          },
          {
            path: '/production/:id/detail',
            name: 'detail',
            component: './Production/Detail',
            hideInMenu: true,
          },
          {
            path: '/production/registration',
            name: 'registration',
            component: './Production/Registration',
          }
        ]
      },
      //sample
      {
        path: '/sample',
        name: 'sample',
        icon: 'plus-square',
        routes: [
          {
            path: '/sample/list',
            name: 'list',
            component: './Sample/List',
          },
          {
            path: '/sample/:id/detail',
            name: 'detail',
            component: './Sample/Detail',
            hideInMenu: true,
          },
          {
            path: '/sample/registration',
            name: 'registration',
            component: './Sample/Registration',
          }
        ]
      },
      //customer
      {
        path: '/customer',
        name: 'customer',
        icon: 'plus-square',
        hideInMenu: true,

        routes: [
          {
            path: '/customer/list',
            name: 'list',
            component: './Customer/List',
          },
          {
            path: '/customer/registration',
            name: 'registration',
            component: './Customer/Registration',
          }
        ]
      },
      //image
      {
        path: '/image',
        name: 'image',
        icon: 'plus-square',
        routes: [
          {
            path: '/image/list',
            name: 'list',
            component: './Image/List',
          },
          {
            path: '/image/registration',
            name: 'registration',
            component: './Image/Registration',
          }
        ]
      },
      {
        name: 'account',
        icon: 'user',
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
              // {
              //   path: '/account/settings/security',
              //   component: './Account/Settings/SecurityView',
              // },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
