// hooks/useCliAuth.ts
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cliAuthService } from '../services/api';

type Status = 'pending' | 'success' | 'error';

export const useCliAuth = () => {
  const [status, setStatus] = useState<Status>('pending');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stateParam = params.get('state');

    if (stateParam) {
      localStorage.setItem('pendingCliState', stateParam);
    }

    const pendingState = localStorage.getItem('pendingCliState');

    if (!pendingState) {
      setError('Missing state parameter. Please initiate the authentication process from the CLI again.');
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const response = await cliAuthService.getProfile();
        const profile = response.value;

        if (!profile || !profile.id) {
          navigate('/login');
          return;
        }

        const result = await cliAuthService.approve(pendingState);

        if (result?.success || result?.status === 'approved') {
          setStatus('success');
          localStorage.removeItem('pendingCliState');
        } else {
          setError(result?.message || 'Approval failed. Please try again.');
          setStatus('error');
        }
      } catch (err: any) {
        setError(err?.message || 'An unexpected error occurred during authentication. Please try again.');
        setStatus('error');
      }
    };

    verify();
  }, [location, navigate]);

  return { status, error };
};
