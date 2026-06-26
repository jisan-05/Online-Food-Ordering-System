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

export function isCustomerRole(role) {
  return role === 'customer'
}

export function isOwnerRole(role) {
  return role === 'owner'
}

export function isAdminRole(role) {
  return role === 'admin'
}

export function getNavbarPanel(role) {
  if (!role) {
    return null
  }

  return {
    label: `${getRoleLabel(role)} Panel`,
    to: getRoleHome(role),
    end: role === 'customer',
  }
}
