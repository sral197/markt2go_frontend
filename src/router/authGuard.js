import { getInstance } from 'boot/auth0'

export const authGuard = (to, from, next) => {
  const authService = getInstance()

  const fn = () => {
    // If the user is authenticated, continue with the route
    if (authService.isAuthenticated) {
      // Check if the email is verified
      if (!authService.user.email_verified && to.path !== '/profile') {
        return next('/profile')
      } else {
        return next()
        // return next('/profile')
      }
    }

    // Otherwise, log in
    let url2redirect = `${window.location}`.replace(window.location.hash, '')
    url2redirect = `${url2redirect}#${to.fullPath}`
    authService.loginWithRedirect({ redirect_uri: url2redirect })
  }

  // If loading has already finished, check our auth state using `fn()`
  if (!authService.loading) {
    return fn()
  }

  // Watch for the loading property to change before we check isAuthenticated
  authService.$watch('loading', loading => {
    if (loading === false) {
      return fn()
    }
  })
}
