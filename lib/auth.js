// MSAL Configuration with your Entra ID credentials
const msalConfig = {
  auth: {
    clientId: '04d3be8d-d433-4367-893e-eccc82190a11',
    authority: 'https://login.microsoftonline.com/b9cc8284-05ed-452f-877a-970779430dcb',
    redirectUri: window.location.origin + '/callback'
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  },
  system: {
    allowNativeBroker: false
  }
};

const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read']
};

let msalInstance = null;

export async function initMSAL() {
  try {
    if (!window.msal) {
      console.warn('MSAL not loaded yet');
      return null;
    }

    msalInstance = new window.msal.PublicClientApplication(msalConfig);
    await msalInstance.initialize();

    // Check if returning from redirect
    const response = await msalInstance.handleRedirectPromise();
    if (response) {
      console.log('✓ Authenticated from redirect:', response.account.name);
      return response.account;
    }

    // Check if already logged in
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      console.log('✓ Already authenticated as:', accounts[0].name);
      return accounts[0];
    }

    return null;
  } catch (error) {
    console.error('MSAL init error:', error.message);
    return null;
  }
}

export async function loginWithMicrosoft() {
  try {
    if (!msalInstance) {
      console.error('MSAL not initialized');
      return null;
    }

    const response = await msalInstance.loginPopup(loginRequest);
    console.log('✓ Login successful:', response.account.name);
    return response.account;
  } catch (error) {
    if (error.errorCode === 'user_cancelled') {
      console.log('User cancelled login');
    } else {
      console.error('Login error:', error.errorCode, error.errorMessage);
    }
    return null;
  }
}

export async function getAccessToken() {
  try {
    if (!msalInstance) return null;

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    const tokenRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
      account: accounts[0]
    };

    const response = await msalInstance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Token error:', error.message);
    return null;
  }
}

export async function logout() {
  try {
    if (!msalInstance) return;

    const logoutRequest = {
      account: msalInstance.getAllAccounts()[0]
    };

    await msalInstance.logout(logoutRequest);
    console.log('✓ Logged out');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export function getCurrentUser() {
  if (!msalInstance) return null;
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
}

export function getUserEmail() {
  // Check for demo account email first (set during demo login)
  if (window.userEmail) return window.userEmail

  const user = getCurrentUser()
  if (!user) return null
  // Return the username (which is the user's email/UPN)
  return user.username || user.mail || user.email
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
