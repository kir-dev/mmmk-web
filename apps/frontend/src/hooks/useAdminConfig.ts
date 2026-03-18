import { useCallback, useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { ReservationConfig, UpdateConfigInput } from '@/types/admin';

export function useAdminConfig() {
  const [config, setConfig] = useState<ReservationConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const response = await axiosApi.get<ReservationConfig>('/admin/config');
      setConfig(response.data);
    } catch (error) {
      console.error(error);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: UpdateConfigInput) => {
    try {
      const response = await axiosApi.patch<ReservationConfig>('/admin/config', data);
      setConfig(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, update, refetch: fetchConfig };
}
