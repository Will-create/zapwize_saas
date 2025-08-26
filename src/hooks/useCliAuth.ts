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
    const timestamp = params.get('timestamp'); // optional

    // Save state in localStorage if present
    if (stateParam) {
      localStorage.setItem('pendingCliState', stateParam);
    }

    const pendingState = localStorage.getItem('pendingCliState');

    if (!pendingState) {
      setError('Missing state parameter');
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        // 1. Check if user has valid session
        const response = await cliAuthService.getProfile();

        let profile = response.value;
        console.log('Profile picture: ', profile);
        if (!profile || !profile.id) {
          // Not logged in → redirect to login
          navigate('/login');
          return;
        }

        // 2. Approve CLI auth
        const result = await cliAuthService.approve(pendingState);

        if (result?.success || result?.status === 'approved') {
          setStatus('success');
          localStorage.removeItem('pendingCliState');
        } else {
          setError('Approval failed');
          setStatus('error');
        }
      } catch (err: any) {
        setError(err?.message || 'Authentication failed');
        setStatus('error');
      }
    };

    verify();
  }, [location, navigate]);

  return { status, error };
};
