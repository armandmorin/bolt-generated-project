const SESSION_KEY = 'user_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const sessionManager = {
  // Create a new session
  createSession(userData) {
    const session = {
      user: userData,
      expiresAt: new Date().getTime() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  // Get current session
  getSession() {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    if (new Date().getTime() > session.expiresAt) {
      this.clearSession();
      return null;
    }

    return session.user;
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getSession();
  },

  // Clear session
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('userRole');
  },

  // Update session
  updateSession(userData) {
    const currentSession = this.getSession();
    if (currentSession) {
      this.createSession({ ...currentSession, ...userData });
    }
  }
};
