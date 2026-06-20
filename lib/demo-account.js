import { getUserEmail } from './auth.js'

const DEMO_ACCOUNTS = [
  'demo@contoso.com',
  'demo@m365ops.com',
  'demo.user@contoso.com',
  'rajkumar.mcitp@gmail.com',
]

export function isDemoAccount() {
  // Check if demo mode is forced via localStorage (for testing)
  if (localStorage.getItem('FORCE_DEMO_MODE') === 'true') {
    console.log('✅ Demo mode FORCED via localStorage')
    return true
  }

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
