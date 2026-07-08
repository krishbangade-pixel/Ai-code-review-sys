import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// Helper function to transform Supabase session into user object
const createUserObject = (session, theme) => {
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.name || session.user.email.split('@')[0],
    avatar: session.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    githubConnected: session.user.user_metadata?.githubConnected || false,
    credits: session.user.user_metadata?.credits || 100,
    tier: session.user.user_metadata?.tier || 'Developer Pro',
    notifications: session.user.user_metadata?.notifications || {
      emailAlerts: true,
      weeklyDigest: false,
      securityAlerts: true,
    },
    emailConfirmed: session.user.email_confirmed_at !== null,
    themePreference: theme
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pulsar_theme') || 'dark';
  });

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('pulsar_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Sync Supabase Auth session with App user state
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userObj = createUserObject(session, theme);
          setUser(userObj);
          localStorage.setItem('pulsar_user', JSON.stringify(userObj));
        } else {
          setUser(null);
          localStorage.removeItem('pulsar_user');
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const userObj = createUserObject(session, theme);
        setUser(userObj);
        localStorage.setItem('pulsar_user', JSON.stringify(userObj));
        
      } else {
        setUser(null);
        localStorage.removeItem('pulsar_user');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [theme]);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('rate')) {
          toast.error('Too many login attempts. Please wait a moment before trying again.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return false;
      }

      if (data?.session) {
        const userObj = createUserObject(data.session, theme);
        setUser(userObj);
        localStorage.setItem('pulsar_user', JSON.stringify(userObj));
        if (rememberMe) {
          localStorage.setItem('pulsar_remember_me', 'true');
        }
        toast.success('Successfully logged in!');
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred during login');
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email, password, name) => {
    setLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', email)
        .single();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
            credits: 100,
            tier: 'Developer Pro',
            githubConnected: false,
            notifications: {
              emailAlerts: true,
              weeklyDigest: false,
              securityAlerts: true,
            }
          },
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else if (error.message.includes('rate')) {
          toast.error('Too many signup attempts. Please wait before trying again.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return false;
      }

      if (data?.user) {
        // If signup was successful, try to auto-login
        if (data?.session) {
          const userObj = createUserObject(data.session, theme);
          setUser(userObj);
          localStorage.setItem('pulsar_user', JSON.stringify(userObj));
          toast.success('Account created! Welcome to PulsarAI.');
          setLoading(false);
          return true;
        } else {
          toast.success('Account created! Please check your email to confirm your registration.');
          setLoading(false);
          return true;
        }
      }

      setLoading(false);
      return false;
    } catch (err) {
      console.error('SignUp error:', err);
      toast.error('An unexpected error occurred during signup');
      setLoading(false);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password?reset=true`,
      });

      if (error) {
        if (error.message.includes('rate')) {
          toast.error('Too many reset requests. Please wait before trying again.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return false;
      }

      // Supabase sends emails regardless of whether the account exists (security best practice)
      toast.success('Password reset instructions sent to your email if an account exists with that email!');
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
      } else {
        setUser(null);
        localStorage.removeItem('pulsar_user');
        localStorage.removeItem('pulsar_remember_me');
        toast.success('Logged out successfully');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    if (!user) {
      toast.error('No active user session');
      return false;
    }

    setLoading(true);
    try {
      const updatedMetadata = {
        name: data.name !== undefined ? data.name : user.name,
        avatar: data.avatar !== undefined ? data.avatar : user.avatar,
        githubConnected: data.githubConnected !== undefined ? data.githubConnected : user.githubConnected,
        notifications: data.notifications !== undefined ? data.notifications : user.notifications,
        credits: data.credits !== undefined ? data.credits : user.credits,
        tier: data.tier !== undefined ? data.tier : user.tier,
      };

      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: updatedMetadata
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      const updatedUserObj = createUserObject({ user: updatedUser.user }, theme);
      setUser(updatedUserObj);
      localStorage.setItem('pulsar_user', JSON.stringify(updatedUserObj));
      toast.success('Profile updated successfully');
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error('An error occurred while updating profile');
      setLoading(false);
      return false;
    }
  };

  const updatePassword = async (current, newPass) => {
    setLoading(true);
    try {
      // Get current session to see if we're in a recovery flow
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('No active session. Please sign in first.');
        setLoading(false);
        return false;
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPass
      });

      if (error) {
        if (error.message.includes('not authorized')) {
          toast.error('Your password reset link has expired. Please request a new one.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return false;
      }

      toast.success('Password changed successfully');
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Update password error:', err);
      toast.error('An error occurred while updating password');
      setLoading(false);
      return false;
    }
  };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem('pulsar_user');
    toast.success('Account permanently deleted (Simulated)');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      theme,
      login,
      signUp,
      forgotPassword,
      logout,
      updateProfile,
      updatePassword,
      deleteAccount,
      toggleTheme,
      setTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
