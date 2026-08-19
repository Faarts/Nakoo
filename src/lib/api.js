const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 
      'Content-Type': 'application/json', 
      ...(import.meta.env.VITE_BYPASS_AUTH === 'true' ? { 'X-Bypass-User': 'bypass-id' } : {}),
      ...(options.headers || {}) 
    },
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
};
