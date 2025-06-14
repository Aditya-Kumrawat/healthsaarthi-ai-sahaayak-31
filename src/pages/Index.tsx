import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentView('dashboard');
      }
    };
    
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleLogin = () => {
    setCurrentView('auth');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('landing');
  };

  switch (currentView) {
    case 'landing':
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      );
    case 'auth':
      return (
        <AuthScreen 
          onBack={handleBackToLanding}
          onAuthSuccess={handleAuthSuccess}
        />
      );
    case 'dashboard':
      return (
        <Dashboard 
          onLogout={handleLogout}
        />
      );
    default:
      return (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      );
  }
};

export default Index;