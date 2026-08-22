// Admin Authentication and Password Management Utility

const ADMIN_AUTH_SESSION_KEY = 'trendpulse_admin_session_auth';
const ADMIN_CUSTOM_PASS_KEY = 'trendpulse_admin_custom_password';
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export interface AdminAuthConfig {
  username: string;
  hasCustomPassword: boolean;
  lastUpdated?: string;
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(authenticated: boolean): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    }
  } catch {}
}

export function getStoredAdminPassword(): string {
  try {
    const custom = localStorage.getItem(ADMIN_CUSTOM_PASS_KEY);
    if (custom && custom.trim().length > 0) {
      return custom;
    }
  } catch {}
  return DEFAULT_ADMIN_PASSWORD;
}

export async function verifyAdminLogin(usernameInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> {
  const cleanUser = (usernameInput || '').trim().toLowerCase();
  const cleanPass = (passwordInput || '').trim();

  // Try fetching synced password from server first if available
  let expectedPassword = getStoredAdminPassword();
  try {
    const res = await fetch('/api/admin/auth-status');
    if (res.ok) {
      const data = await res.json();
      if (data.configuredPassword) {
        expectedPassword = data.configuredPassword;
        localStorage.setItem(ADMIN_CUSTOM_PASS_KEY, expectedPassword);
      }
    }
  } catch {}

  if (cleanUser !== DEFAULT_ADMIN_USERNAME) {
    return { success: false, error: 'Invalid username. Default username is "admin".' };
  }

  if (cleanPass !== expectedPassword) {
    return { 
      success: false, 
      error: 'Invalid password. If you forgot your custom password, enter your configured password or reset it.' 
    };
  }

  setAdminAuthenticated(true);
  return { success: true };
}

export async function changeAdminPassword(
  currentPasswordInput: string, 
  newPasswordInput: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const currentClean = (currentPasswordInput || '').trim();
  const newClean = (newPasswordInput || '').trim();

  const expectedPassword = getStoredAdminPassword();

  if (currentClean !== expectedPassword) {
    return { success: false, error: 'Current password does not match.' };
  }

  if (!newClean || newClean.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long.' };
  }

  // 1. Save to local storage for instant access across tabs
  localStorage.setItem(ADMIN_CUSTOM_PASS_KEY, newClean);

  // 2. Sync to backend API if available
  try {
    await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: currentClean,
        newPassword: newClean,
      }),
    });
  } catch (err) {
    console.warn('Backend password sync notice:', err);
  }

  return { 
    success: true, 
    message: 'Admin password updated successfully! Future logins will require this new password.' 
  };
}

export async function resetAdminPasswordToDefault(): Promise<{ success: boolean; message: string }> {
  localStorage.removeItem(ADMIN_CUSTOM_PASS_KEY);

  try {
    await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resetToDefault: true,
      }),
    });
  } catch {}

  return { 
    success: true, 
    message: `Admin password reset to default: "${DEFAULT_ADMIN_PASSWORD}"` 
  };
}
