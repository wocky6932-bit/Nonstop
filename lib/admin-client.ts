// Utility functions for admin verification (client-side)
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