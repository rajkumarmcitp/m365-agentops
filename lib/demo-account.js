import { getUserEmail } from './auth.js'

const DEMO_ACCOUNTS = [
  'demo@contoso.com',
  'demo@m365ops.com',
  'demo.user@contoso.com',
]

export function isDemoAccount() {
  const email = getUserEmail()
  console.log('🔍 isDemoAccount() check - email:', email)
  if (!email) {
    console.log('❌ No email found')
    return false
  }
  const lowerEmail = email.toLowerCase()
  const isDemo = DEMO_ACCOUNTS.some(account => lowerEmail === account.toLowerCase())
  console.log(`✅ isDemoAccount result: ${isDemo}`)
  return isDemo
}

export function getDemoAccountStatus() {
  if (isDemoAccount()) {
    return { isDemo: true, email: getUserEmail() }
  }
  return { isDemo: false, email: getUserEmail() }
}
