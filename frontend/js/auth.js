import { apiRequest, setAuthTokens, clearAuth } from "./api.js";
import { loadFeed } from "./feed.js";

function formatError(err) {
  if (Array.isArray(err.errors) && err.errors.length) {
    return err.errors.map((e) => e.message).join(", ");
  }
  return err.message;
}

const authSection = document.getElementById("auth-section");
const newPostSection = document.getElementById("new-post-section");
const feedSection = document.getElementById("feed-section");
const userInfo = document.getElementById("user-info");

function showLoggedIn(username) {
  authSection.classList.add("hidden");
  newPostSection.classList.remove("hidden");
  feedSection.classList.remove("hidden");
  userInfo.innerHTML = `
    Logged in as <strong>${username}</strong>
    <button id="logout-btn" style="margin-left:8px;padding:3px 8px;font-size:0.75rem;">Logout</button>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({}), // optional: send refreshToken if you want
      });
    } catch (e) {
      // ignore errors here
    }
    clearAuth();
    authSection.classList.remove("hidden");
    newPostSection.classList.add("hidden");
    feedSection.classList.add("hidden");
    userInfo.textContent = "";
  });
}

function showLoggedOut() {
  authSection.classList.remove("hidden");
  newPostSection.classList.add("hidden");
  feedSection.classList.add("hidden");
  userInfo.textContent = "";
}

// Register
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  try {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("Register failed: " + (formatError(err) || res.status));
      return;
    }

    alert("Registered! You can now log in.");
    registerForm.reset();
  } catch (err) {
    console.error(err);
    alert("Register error");
  }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("Login failed: " + (formatError(err) || res.status));
      return;
    }

    const data = await res.json();
    setAuthTokens(data);

    const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
    showLoggedIn(payload.username);

    await loadFeed(); 
    loginForm.reset();
  } catch (err) {
    console.error(err);
    alert("Login error");
  }
});

export { showLoggedIn, showLoggedOut };
