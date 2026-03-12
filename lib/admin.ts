// Utility functions for admin verification
// This avoids direct database calls to the admins table to prevent RLS recursion

const ADMIN_EMAILS = [
  'adminnonstop@gmail.com',
  // Add other admin emails here as needed
]

/**
 * Check if an email belongs to an admin
 * This function avoids database calls to prevent RLS recursion
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Check if current user is an admin
 * This function avoids database calls to prevent RLS recursion
 */
export async function isCurrentUserAdmin(user: any): Promise<boolean> {
  if (!user?.email) return false
  return isAdmin(user.email)
}

/**
 * Redirect if user is not an admin
 */
export function requireAdmin(isAdmin: boolean, redirectTo: string = '/'): never {
  if (!isAdmin) {
    throw new Error('Redirect required')
  }
  throw new Error('Admin access granted')
}