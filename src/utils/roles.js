export const roleHomePaths = {
  admin: '/admin',
  owner: '/owner',
  customer: '/dashboard',
}

export function getRoleHome(role) {
  return roleHomePaths[role] || roleHomePaths.customer
}

export function getRoleLabel(role) {
  const labels = {
    admin: 'Admin',
    owner: 'Owner',
    customer: 'Customer',
  }

  return labels[role] || labels.customer
}
