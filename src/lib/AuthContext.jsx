import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
        setProfile({ 
          id: 'bypass-profile', 
          child_name: 'Bypass Child', 
          birth_date: '2025-01-01', 
          alergies: '[]', 
          focus_skills: '[]', 
          available_materials: '[]' 
        });
        return;
      }

      const { profile } = await api.get('/api/child-profiles');
      setProfile(profile || null);
    } catch {
      setProfile(null);
    }
  };

  const refreshAuth = async () => {
    try {
      if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
        setUser({ id: 'bypass-id', name: 'Dev Bypass User', email: 'dev@nakoo.app' });
        await fetchProfile();
        setLoading(false);
        return;
      }

      const { user } = await api.get('/api/auth/me');
      setUser(user);
      await fetchProfile();
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshAuth(); }, []);

  const value = {
    user,
    profile,
    loading,
    refreshAuth,
    refreshProfile: fetchProfile,
    logout: async () => {
      await api.post('/api/auth/logout');
      setUser(null);
      setProfile(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
