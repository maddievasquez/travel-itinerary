/**
 * Cookies utility for managing authentication tokens
 */
const Cookie = {
  /**
   * Set a cookie with the given name and value
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Expiration in days (default: 7)
   */
  setCookie: (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  },

  /**
   * Get a cookie value by name
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null if not found
   */
  getCookie: (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  /**
   * Remove a cookie by name
   * @param {string} name - Cookie name
   */
  deleteCookie: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  },

  /**
   * Handle logout by removing all auth-related cookies
   */
  logoutClickHandler: () => {
    Cookie.deleteCookie('access');
    Cookie.deleteCookie('refresh');
    // Add any other auth-related cookies to delete
  },

  /**
   * Check if user is authenticated by verifying the access token exists
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!Cookie.getCookie('access');
  }
};

export default Cookie;