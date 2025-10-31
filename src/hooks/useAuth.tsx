import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
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
    
    // Explicitly set session and user
    setSession(data.session);
    setUser(data.user);
    
    // Force a session refresh to ensure everything is in sync
    const { data: { session: refreshedSession } } = await supabase.auth.getSession();
    if (refreshedSession) {
      setSession(refreshedSession);
      setUser(refreshedSession.user);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Call our backend to create user with confirmed email
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-2ba89cfc/signup`;
      console.log('Signup URL:', url);
      console.log('Signup data:', { email, name, passwordLength: password.length });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      console.log('Signup response status:', response.status);
      console.log('Signup response headers:', Object.fromEntries(response.headers.entries()));

      // Try to get response text first
      const responseText = await response.text();
      console.log('Signup response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Signup failed (Status ${response.status})`;
        
        // Handle specific status codes
        if (response.status === 401) {
          errorMessage = 'Authentication error - this should not happen. Please contact support.';
        } else if (response.status === 500) {
          errorMessage = 'Server error - please try again later.';
        }
        
        // Try to parse as JSON
        try {
          const data = JSON.parse(responseText);
          errorMessage = data.error || errorMessage;
          console.log('Signup error data:', data);
        } catch (e) {
          console.log('Response is not JSON:', responseText.substring(0, 200));
          if (responseText.includes('html')) {
            errorMessage = 'Server error - backend may not be running. Please contact support.';
          } else if (responseText) {
            errorMessage = `Server error: ${responseText.substring(0, 100)}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Signup successful:', result);
        
        // Check if this is actually an error that returned 200
        if (result.error) {
          throw new Error(result.error);
        }
      } catch (e) {
        // If it's already an Error, rethrow it
        if (e instanceof Error) {
          throw e;
        }
        console.error('Could not parse success response:', responseText);
        throw new Error('Invalid server response');
      }

      // Now sign in
      console.log('Attempting auto sign-in...');
      await signIn(email, password);
      console.log('Sign-in successful!');
    } catch (error: any) {
      console.error('Signup error:', error);
      // Re-throw with more context
      if (error.message) {
        throw error;
      } else {
        throw new Error('Signup failed - ' + String(error));
      }
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
    // Clear state
    setUser(null);
    setSession(null);
    
    // Verify session is cleared
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.warn('Session still exists after signOut, forcing clear');
      // If session still exists, try again
      await supabase.auth.signOut();
    }
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
