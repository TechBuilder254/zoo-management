import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { supabase } from '../config/supabase';
import { supabaseAuthService } from '../services/supabaseAuthService';
import toast from 'react-hot-toast';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if this is a verification redirect from email
        const { data, error } = await supabase.auth.getSession();
        
        if (data.session?.user?.email_confirmed_at) {
          setStatus('success');
          toast.success('Email verified successfully!');
          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else if (error) {
          setStatus('error');
          toast.error('Email verification failed');
        } else {
          // User is not verified yet
          setEmail(data.session?.user?.email || '');
          setStatus('pending');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [navigate]);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      await supabaseAuthService.resendVerification(email);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={64} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={64} className="text-red-500" />;
      case 'pending':
        return <Mail size={64} className="text-blue-500" />;
      default:
        return <Loader2 size={64} className="text-gray-500 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      case 'pending':
        return 'Email Verification Required';
      default:
        return 'Verifying Email...';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Your email has been successfully verified. You will be redirected to login shortly.';
      case 'error':
        return 'There was an error verifying your email. Please try again or contact support.';
      case 'pending':
        return `We've sent a verification email to ${email}. Please check your inbox and click the verification link to complete your registration.`;
      default:
        return 'Please wait while we verify your email...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card padding="lg" className="text-center">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {getStatusTitle()}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getStatusMessage()}
          </p>

          {status === 'success' && (
            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/register')}
              >
                Try Again
              </Button>
            </div>
          )}

          {status === 'pending' && (
            <div className="space-y-4">
              <Button
                variant="outline"
                fullWidth
                onClick={handleResendVerification}
                disabled={isResending}
                isLoading={isResending}
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 size={24} className="animate-spin text-gray-500" />
            </div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <a href="/contact" className="text-primary hover:text-primary-dark font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
