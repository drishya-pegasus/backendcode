import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: ""
  });

  // Update Axios default headers whenever the auth state changes
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = auth.token;

    // Check if there's data in localStorage to set the initial auth state
    const data = localStorage.getItem('auth');
    if (data) {
      const parsedData = JSON.parse(data);
      setAuth({
        user: parsedData.user,
        token: parsedData.token,
      });
    }
  }, [auth.token]); // Dependency array includes auth.token

  // Handle user logout or any auth changes
  useEffect(() => {
    if (!auth.token) {
      axios.defaults.headers.common['Authorization'] = null; // Clear header on logout
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
    