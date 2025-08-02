/* auth.js - JWT auth wiring for WanderWise
 * Requires certain IDs to exist in the DOM (see instructions).
 * Backend expected at: {AUTH_API_BASE}/auth
 */
(function () {
  // ========= CONFIG =========
  const API_BASE = (window.AUTH_API_BASE || "http://localhost:5000").replace(/\/+$/, "");
  const AUTH_URL = `${API_BASE}/auth`;

  // ========= UTIL =========
  const $ = (id) => document.getElementById(id);

  function safeNotify(msg) {
    if (typeof showNotification === "function") {
      showNotification(msg);
    } else {
      alert(msg);
    }
  }

  async function api(path, { method = "GET", body, auth = true } = {}) {

    const headers = { "Content-Type": "application/json" };
    // No need to send Authorization header, JWT is in cookie

    const res = await fetch(`${AUTH_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Send cookies with request
    });


    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const message = data.message || data.error || res.statusText;
      throw new Error(message);
    }

    return data;
  }

  function setAuthUI({ loggedIn, username = "" }) {
    const hello = $("authHello");
    const userNameSpan = $("authUserName");
    const loginBtn = $("loginBtn");
    const signupBtn = $("signupBtn");
    const logoutBtn = $("logoutBtn");

    if (!hello || !userNameSpan || !loginBtn || !signupBtn || !logoutBtn) return;

    if (loggedIn) {
      hello.style.display = "flex";
      userNameSpan.textContent = username || "User";
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      hello.style.display = "none";
      userNameSpan.textContent = "";
      loginBtn.style.display = "inline-block";
      signupBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
    }
  }

  function openModal(modal) {
    if (modal) modal.style.display = "flex";
  }

  function closeModal(modal) {
    if (modal) modal.style.display = "none";
  }

  function logout() {
    // Remove token cookie by expiring it (optional, backend should provide a logout endpoint for full security)
    document.cookie = 'token=; Max-Age=0; path=/;';
    setAuthUI({ loggedIn: false });
    safeNotify("Logged out");
  }

  async function loadUserProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthUI({ loggedIn: false });
      return;
    }

    try {
      const me = await api("/me", { auth: true });
      // Your backend may return either { username, email, ... } or { user: { ... } } or { userId: ... }
      const username =
        me.username ||
        (me.user && me.user.username) ||
        me.email ||
        (me.user && me.user.email) ||
        me.userId ||
        "User";

      setAuthUI({ loggedIn: true, username });
    } catch (e) {
      console.error("Failed to load profile:", e.message);
      logout();
    }
  }

  function attachHandlers() {
    const loginBtn = $("loginBtn");
    const signupBtn = $("signupBtn");
    const logoutBtn = $("logoutBtn");

    const loginModal = $("loginModal");
    const signupModal = $("signupModal");

    const loginClose = $("loginClose");
    const signupClose = $("signupClose");

    const loginForm = $("loginForm");
    const signupForm = $("signupForm");

    // Open modals
    loginBtn && loginBtn.addEventListener("click", () => openModal(loginModal));
    signupBtn && signupBtn.addEventListener("click", () => openModal(signupModal));

    // Close modals
    loginClose && loginClose.addEventListener("click", () => closeModal(loginModal));
    signupClose && signupClose.addEventListener("click", () => closeModal(signupModal));

    // Click outside to close
    [loginModal, signupModal].forEach((m) => {
      if (!m) return;
      m.addEventListener("click", (e) => {
        if (e.target === m) closeModal(m);
      });
    });

    // Logout
    logoutBtn && logoutBtn.addEventListener("click", logout);

    // Signup submit
    signupForm &&
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = $("signupUsername").value.trim();
        const email = $("signupEmail").value.trim();
        const password = $("signupPassword").value;

        try {
          await api("/signup", {
            method: "POST",
            auth: false,
            body: { username, email, password },
          });

          safeNotify("Signup successful! Please log in.");
          closeModal(signupModal);
          openModal(loginModal);
        } catch (err) {
          console.error("Signup error:", err.message);
          safeNotify(`Signup failed: ${err.message}`);
        }
      });

    // Login submit
    loginForm &&
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = $("loginEmail").value.trim();
        const password = $("loginPassword").value;

        try {
          await api("/login", {
            method: "POST",
            auth: false,
            body: { email, password },
          });

          await loadUserProfile();
          safeNotify("Login successful!");
          closeModal(loginModal);
        } catch (err) {
          console.error("Login error:", err.message);
          safeNotify(`Login failed: ${err.message}`);
        }
      });
  }

  // ========= INIT =========
  document.addEventListener("DOMContentLoaded", async () => {
    attachHandlers();
    await loadUserProfile();
  });
})();
