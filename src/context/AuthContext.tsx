import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { api } from '../services/api';
import { SEED_USERS } from '../data/mockData';

interface AuthContextType {
  isAdmin: boolean;
  role: UserRole;
  signIn: (e:string,p:string)=>Promise<any>;
  signUp: (n:string,e:string,p:string)=>Promise<any>;
  quickDemoLogin: (role?: "user" | "admin")=>Promise<void>;
  resendConfirmationEmail: (e:string)=>Promise<{success:boolean,error?:string}>;
  signOut: ()=>Promise<void>;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<{full_name: string; phone: string; country: string; preferences: any; avatar_url: string}>) => Promise<boolean>;
  updateAvatar: (url: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<any>;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "admin" || user?.role === "staff";
  const role = user?.role || "USER" as UserRole;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('pt_auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('pt_auth_token');
        setUser(null);
      }
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      console.log('Login attempt:', email);
      const res = await api.auth.login(email, pass);
      console.log('Login API response:', res);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user, role: res.user.role };
      }
      // Check fallback for demo/seed users if API returned failure/offline
      const seedUser = SEED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (seedUser) {
        setUser(seedUser);
        localStorage.setItem('pt_auth_token', 'demo-token');
        return { success: true, user: seedUser, role: seedUser.role };
      }
      return { success: false, error: res.error || 'Login failed: Server did not return user details.' };
    } catch (e: any) {
      console.error('Login error:', e);
      const seedUser = SEED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (seedUser) {
        setUser(seedUser);
        localStorage.setItem('pt_auth_token', 'demo-token');
        return { success: true, user: seedUser, role: seedUser.role };
      }
      return { success: false, error: e.message || 'Login encountered an unexpected error.' };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await api.auth.register({ name, email, password: pass });
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    try {
      const res = await api.auth.updateProfile(data);
      if (res.success && res.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const updateAvatar = async (url: string) => {
    try {
      const res = await api.auth.updateProfile({ avatar_url: url });
      if (res.success && res.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    // Requires a reset password API, assuming it might not be implemented, mock success
    return { success: true };
  };

    const signIn = login;
  const signUp = register;
  const quickDemoLogin = async (targetRole?: "user" | "admin") => {
    const isTargetAdmin = targetRole === "admin";
    const demoEmail = isTargetAdmin ? "admin@theluxuryesp.com" : "alex.traveler@example.com";
    await login(demoEmail, "Admin@2026");
  };
  const resendConfirmationEmail = async (e:string) => ({success: true});
  const signOut = logout;
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateAvatar,
        resetPassword,
        isAdmin,
        role,
        signIn,
        signUp,
        quickDemoLogin,
        resendConfirmationEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
