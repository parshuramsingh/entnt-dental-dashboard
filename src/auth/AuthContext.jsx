import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const DUMMY_USERS = [
  { email: 'admin@entnt.in', password: 'admin123', role: 'admin' },
  { email: 'john@entnt.in', password: 'john123', role: 'patient', patientId: 'p1' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  function login(email, password) {
    const found = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
