import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { CoursePageEnhanced } from './components/CoursePageEnhanced';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { api } from './utils/api';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, session, loading: authLoading } = useAuth();
  const [view, setView] = useState<'landing' | 'auth' | 'onboarding' | 'dashboard' | 'course'>('landing');
  const [profile, setProfile] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  // Determine the access token
  const accessToken = session?.access_token || '';

  // Load user data when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !accessToken) {
        // Clear all data when logged out
        setView('landing');
        setProfile(null);
        setRoadmap(null);
        setProgress([]);
        return;
      }

      setDataLoading(true);
      try {
        // Load profile
        const { profile: userProfile } = await api.getProfile(accessToken);
        setProfile(userProfile);

        // Check if onboarding is complete
        if (!userProfile.onboardingComplete) {
          setView('onboarding');
          setDataLoading(false);
          return;
        }

        // Load roadmap
        const { roadmap: userRoadmap } = await api.getRoadmap(accessToken);
        setRoadmap(userRoadmap);

        // Load progress
        const { progress: userProgress } = await api.getProgress(accessToken);
        setProgress(userProgress || []);

        setView('dashboard');
      } catch (error: any) {
        console.error('Failed to load user data:', error);
        toast.error('Failed to load your data. Please try refreshing.');
      } finally {
        setDataLoading(false);
      }
    };

    if (user && accessToken) {
      loadUserData();
    } else {
      // Ensure we clear state when user logs out
      setProfile(null);
      setRoadmap(null);
      setProgress([]);
      setView('landing');
    }
  }, [user, accessToken]);

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: any) => {
    if (!user || !accessToken) return;

    try {
      // Save profile
      await api.createProfile(
        { ...data, onboardingComplete: true },
        accessToken
      );

      toast.success('Profile created successfully!');

      // Generate roadmap
      toast.info('Generating your personalized learning roadmap...');
      const { roadmap: newRoadmap } = await api.generateRoadmap(accessToken);
      
      setRoadmap(newRoadmap);
      
      // Reload profile
      const { profile: updatedProfile } = await api.getProfile(accessToken);
      setProfile(updatedProfile);

      toast.success('Your learning roadmap is ready!');
      setView('dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete onboarding: ' + error.message);
    }
  };

  // Refresh dashboard data
  const handleRefresh = async () => {
    if (!accessToken) return;
    
    setDataLoading(true);
    try {
      const { progress: userProgress } = await api.getProgress(accessToken);
      setProgress(userProgress || []);
      toast.success('Data refreshed!');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setDataLoading(false);
    }
  };

  // Show loading state
  if (authLoading || (user && dataLoading && view === 'landing')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  // Show appropriate view
  if (!user) {
    if (view === 'auth') {
      return <AuthPage />;
    }
    return <LandingPage onGetStarted={() => setView('auth')} />;
  }

  if (view === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        userName={profile?.name || user.user_metadata?.name || 'there'}
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <EnhancedDashboard
        profile={profile}
        roadmap={roadmap}
        progress={progress}
        onRefresh={handleRefresh}
        onModuleClick={(module: any) => {
          setSelectedModule(module);
          setView('course');
        }}
      />
    );
  }

  if (view === 'course' && selectedModule) {
    const moduleProgress = progress.find(p => p.moduleId === selectedModule.id);
    
    return (
      <CoursePageEnhanced
        module={selectedModule}
        accessToken={accessToken}
        initialProgress={moduleProgress}
        profile={profile}
        onBack={() => {
          setView('dashboard');
          setSelectedModule(null);
        }}
        onComplete={() => {
          handleRefresh();
          toast.success('Module completed! Returning to dashboard...');
          setTimeout(() => {
            setView('dashboard');
            setSelectedModule(null);
          }, 1500);
        }}
      />
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
