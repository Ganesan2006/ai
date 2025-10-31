import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Brain, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  
  const { signIn, signUp } = useAuth();

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    setResetMessage('');

    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const newPassword = prompt('Enter your new password (minimum 6 characters):');
      
      if (!newPassword || newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ba89cfc/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResetMessage('Password reset successful! You can now sign in with your new password.');
        setPassword(newPassword);
        setShowPasswordReset(false);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('Failed to reset password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    try {
      // Validate inputs
      if (isSignUp) {
        if (!name || name.trim().length === 0) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
      }

      if (isSignUp) {
        console.log('Attempting signup...');
        await signUp(email, password, name);
        console.log('Signup successful!');
      } else {
        console.log('Attempting sign in...');
        await signIn(email, password);
        console.log('Sign in successful!');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMsg = err.message || 'Authentication failed';
      
      // Add helpful hints for common errors
      if (errorMsg.includes('fetch')) {
        errorMsg += ' - Please check your internet connection';
      } else if (errorMsg.includes('User already registered') || errorMsg.includes('already exists')) {
        errorMsg = 'This email is already registered. Please sign in instead or reset your password.';
        setIsSignUp(false);
      } else if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('Invalid email or password')) {
        errorMsg = 'Invalid email or password. Please try again or reset your password.';
        setShowPasswordReset(true);
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Start your personalized learning journey' 
              : 'Sign in to continue your learning'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {resetMessage && (
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{resetMessage}</AlertDescription>
              </Alert>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && showPasswordReset && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Reset Password
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>

            <div className="text-center text-sm space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setResetMessage('');
                  setShowPasswordReset(false);
                  setPassword('');
                  setName('');
                }}
                className="text-blue-600 hover:underline block w-full"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
