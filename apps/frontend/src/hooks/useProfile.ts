import axios from 'axios';
import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { User } from '@/types/user';

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axiosApi.get('/users/me', {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Expires: '0' },
      });
      setProfile(response.data);
    } catch (error) {
      console.error(error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get('/logout');
      setProfile(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, fetchProfile, logout };
}
