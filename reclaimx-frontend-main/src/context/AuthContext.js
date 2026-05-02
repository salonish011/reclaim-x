import React, { createContext, useState, useContext } from 'react';

// Step 1: Create the shared notebook
const AuthContext = createContext();

const safeParseLocalStorageJSON = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw || raw === 'undefined' || raw === 'null') return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Invalid JSON in localStorage for key "${key}"`, error);
    return null;
  }
};

// Step 2: The "Provider" wraps the whole app and gives everyone access
export function AuthProvider({ children }) {

  // This stores the logged-in user's info (null means not logged in)
  const [user, setUser] = useState(safeParseLocalStorageJSON('user'));

  // This stores the token Django gives us after login
  const [token, setToken] = useState(
    localStorage.getItem('access_token') || localStorage.getItem('token') || null
  );

  // Called when user logs in successfully
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Keep both keys temporarily for backward compatibility.
    localStorage.setItem('access_token', authToken);
    localStorage.setItem('token', authToken);
  };

  // Called when user clicks logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: A shortcut hook so any page can use it with one line
export function useAuth() {
  return useContext(AuthContext);
}