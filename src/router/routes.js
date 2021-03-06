
import { authGuard } from './authGuard'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout_Customer.vue'),
    children: [
      { path: '', redirect: 'info' },
      { path: 'info', component: () => import('pages/Index.vue') },
      {
        path: 'market',
        component: () => import('pages/customer/BannerRouterView.vue'),
        children: [
          { path: '', component: () => import('pages/customer/Markets.vue') },
          { path: ':marketID', component: () => import('pages/customer/Seller.vue') },
          { path: ':marketID/:sellerID', component: () => import('pages/customer/Reservate.vue') }
        ]
      },
      { path: 'status/:reservationID', component: () => import('pages/customer/ReservationStatus.vue'), beforeEnter: authGuard },
      { path: 'profile', component: () => import('pages/customer/Profile.vue'), beforeEnter: authGuard },
      { path: 'logout', component: () => import('pages/Logout.vue') },
      { path: 'disclaimer', component: () => import('pages/Disclaimer.vue') },
      { path: 'contact', component: () => import('pages/Disclaimer.vue') },
      { path: 'privacy', component: () => import('pages/PrivacyStatement.vue') },
      { path: 'error', name: 'errorPage', component: () => import('pages/Error.vue') }
    ]
  },
  {
    path: '/seller',
    component: () => import('layouts/MainLayout_Seller.vue'),
    children: [
      { path: '', redirect: 'sellerDetails' },
      {
        path: 'sellerDetails',
        component: () => import('pages/seller/EmptyRouterView.vue'),
        children: [
          { path: '', redirect: 'select' },
          { path: 'select', component: () => import('pages/seller/PickMarket.vue') },
          { path: ':marketID', component: () => import('pages/seller/sellerDetails/Edit.vue') }
        ]
      },
      {
        path: 'orders',
        component: () => import('pages/seller/EmptyRouterView.vue'),
        children: [
          { path: '', redirect: 'select' },
          { path: 'select', component: () => import('pages/seller/PickMarket.vue') },
          { path: ':marketID', component: () => import('pages/seller/reservations/ShowAll.vue') },
          { path: ':marketID/:reservationID', component: () => import('pages/seller/reservations/ReservationDetails.vue') }
        ]
      },
      {
        name: 'errorPageSeller',
        path: 'error',
        component: () => import('pages/Error.vue')
      }
    ],
    beforeEnter: authGuard
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
