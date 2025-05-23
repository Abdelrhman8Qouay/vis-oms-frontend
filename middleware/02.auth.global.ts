// middleware/03.auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useAuthStore } from '~/stores/auth.store'

// Public routes that don't require authentication
const publicRoutes: string[] = ['/']
const loginRoutes: string[] = ['/auth/staff/login', '/auth/dashboard/login']

// Role-based home pages
const roleHomePages = {
    cashier: '/staff/cashier',
    chef: '/staff/chef',
    admin: '/dashboard',
}

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()

    // Allow access to public routes
    if (publicRoutes.includes(to.path)) {
        console.log('want publicRoutes')
        return
    }

    // Allow access to login routes for unauthenticated users
    if (loginRoutes.includes(to.path) && !authStore.isAuthenticated) {
        console.log('want loginRoutes and Not auth')
        return
    }

    // Redirect authenticated users to their home page if they try to access login routes
    if (loginRoutes.includes(to.path) && authStore.isAuthenticated) {
        console.log('want loginRoutes and is auth')
        console.log(authStore.user)
        console.log(authStore.token)
        const homePage = roleHomePages[authStore.user?.role as keyof typeof roleHomePages] || '/'
        return navigateTo(homePage)
    }

    // Redirect unauthenticated users to the home page
    if (!authStore.isAuthenticated) {
        console.log('Not Auth')
        return navigateTo('/')
    }

    // Token Expiry Check
    if (authStore.isAuthenticated) {
        const tokenExpiry = authStore.tokenExpiry // Assuming you store token expiry in the auth store
        if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
            console.log('Auth and TokenExpiry')
            authStore.logout()
            return navigateTo('/')
        }
    }

    // Role-based access control
    if (to.path.startsWith('/staff/cashier') && !authStore.isCashier) {
        console.log('want cashier and not cashier')
        return navigateTo('/auth/staff/login')
    }

    if (to.path.startsWith('/staff/chef') && !authStore.isChef) {
        console.log('want chef and not chef')
        return navigateTo('/auth/staff/login')
    }

    if (to.path.startsWith('/dashboard') && !authStore.isAdmin) {
        console.log('want admin and not admin')
        return navigateTo('/auth/dashboard/login')
    }
})
