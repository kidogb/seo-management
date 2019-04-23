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
          },
          {
            path: '/sample/:id/detail',
            name: 'detail',
            component: './Sample/SampleDetail',
            hideInMenu: true,
          },
          {
            path: '/sample/:id/edit',
            name: 'edit',
            component: './Sample/SampleEdit',
            hideInMenu: true,
          },
          {
            path: '/sample/registration',
            name: 'registration',
            component: './Sample/SampleRegistration',
          }
        ]
      },
      //production
      {
        path: '/production',
        name: 'production',
        icon: 'tags',
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
          },
          {
            path: '/production/:id/variations/registration',
            name: 'variations-registration',
            component: './VariationsProduction/VariationsRegistration',
            hideInMenu: true,
          },
          {
            path: '/production/:id/variations/list',
            name: 'variations-list',
            component: './VariationsProduction/VariationsList',
            hideInMenu: true,
          }
        ]
      },
      //image
      {
        path: '/image',
        name: 'image',
        icon: 'file-jpg',
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
      //user
      {
        path: '/users',
        name: 'users',
        icon: 'user',
        // hideInMenu: true,

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
        component: '404',
      },
    ],
  },
];
