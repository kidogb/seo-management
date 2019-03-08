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
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
        ],
      },
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
            path: '/production/registration',
            name: 'registration',
            component: './Production/Registration',
          }
        ]
      },
      //customer
      {
        path: '/customer',
        name: 'customer',
        icon: 'plus-square',
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
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
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
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
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
