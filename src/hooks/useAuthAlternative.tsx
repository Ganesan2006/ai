/**
 * Alternative Auth Hook - Uses Native Supabase Auth
 * 
 * This version bypasses the Edge Function for signup and uses
 * Supabase's built-in authentication directly. Use this if the
 * Edge Function deployment is failing.
 * 
 * To use: Replace the import in App.tsx from './hooks/useAuth' to './hooks/useAuthAlternative'
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    if (!data.session) {
      console.error('No session returned from sign in');
      throw new Error('Failed to create session');
    }

    console.log('Sign in successful, session created:', data.session.user.email);
    
    setSession(data.session);
    setUser(data.user);
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Using native Supabase signup...');
      
      // Use native Supabase signup instead of Edge Function
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('Signup failed - no user returned');
      }

      console.log('Signup successful:', data.user.email);
      
      // Check if email confirmation is required
      if (data.session) {
        // User is auto-confirmed, set session
        console.log('User auto-confirmed, setting session');
        setUser(data.user);
        setSession(data.session);
      } else {
        // Email confirmation required
        console.log('Email confirmation required');
        throw new Error('Please check your email to confirm your account before signing in.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Signing out user...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    
    console.log('Sign out successful, clearing state');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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
