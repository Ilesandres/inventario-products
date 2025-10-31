export const ROUTES = {
  LOGIN: '#/login',
  REGISTER: '#/register',
  PRODUCTS: '#/products',
  CATEGORIES: '#/categories',
  USERS: '#/users',
  SETTINGS: '#/settings',
  DASHBOARD: '#/dashboard',
}

export function navigate(route: string) {
  if (window.location.hash !== route) {
    window.location.hash = route
  }
}

export function getRouteFromHash(hash: string): string {
  if (!hash) return ROUTES.LOGIN
  return hash
}

export default ROUTES
