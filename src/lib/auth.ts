export const getCurrentUserId = (): number | null => {
  try {
    const token =
      (typeof window !== 'undefined' && (localStorage.getItem('accessToken') || localStorage.getItem('authToken'))) ||
      null;
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    const uid = json?.user_id ?? json?.sub ?? null;
    return typeof uid === 'number' ? uid : uid ? Number(uid) : null;
  } catch {
    return null;
  }
};
