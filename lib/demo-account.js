import { getUserEmail } from './auth.js'

const DEMO_ACCOUNTS = [
  'demo@contoso.com',
  'demo@m365ops.com',
  'demo.user@contoso.com',
]

export function isDemoAccount() {
  const email = getUserEmail()
  if (!email) return false
  const lowerEmail = email.toLowerCase()
  return DEMO_ACCOUNTS.some(account => lowerEmail === account.toLowerCase())
}

export function getDemoAccountStatus() {
  if (isDemoAccount()) {
    return { isDemo: true, email: getUserEmail() }
  }
  return { isDemo: false, email: getUserEmail() }
}
