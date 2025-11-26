const API_URL = "http://localhost:3000";

let accessToken = null;
let refreshToken = null;
let currentUser = null;

function setAuthTokens(tokens) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken ?? refreshToken;
  if (tokens.user) currentUser = tokens.user;
}

function clearAuth() {
  accessToken = null;
  refreshToken = null;
  currentUser = null;
}

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (response.status === 401 && refreshToken) {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshed.ok) {
      const data = await refreshed.json();
      accessToken = data.accessToken;
      return apiRequest(path, options);
    } else {
      clearAuth();
    }
  }

  return response;
}

export { apiRequest, setAuthTokens, clearAuth, currentUser, API_URL };
