import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

interface QuotaInfo {
  weeklyHours: number;
  dailyHours: number;
  weeklyLimit: number;
  dailyLimit: number;
  weeklyRemaining: number;
  dailyRemaining: number;
  isOvertime: boolean;
}

export function useQuotaCheck(user?: User, reservations?: Reservation[]) {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>({
    weeklyHours: 0,
    dailyHours: 0,
    weeklyLimit: 8,
    dailyLimit: 4,
    weeklyRemaining: 8,
    dailyRemaining: 4,
    isOvertime: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !reservations) {
      setLoading(false);
      return;
    }

    const calculateQuota = async () => {
      try {
        // Fetch settings from backend (if available)
        let settings = {
          maxHoursPerWeek: 8,
          maxHoursPerDay: 4,
          sanctionHourPenaltyPerPoint: 1,
        };

        try {
          const settingsRes = await axiosApi.get('/settings/1');
          if (settingsRes.data) {
            settings = settingsRes.data;
          }
        } catch (e) {
          // Settings endpoint might not exist yet, use defaults
        }

        // Fetch sanction points for the target user (whose reservation is being made)
        let totalSanctionPoints = 0;
        try {
          const sanctionsRes = await axiosApi.get(`/sanction-records/user/${user.id}`);
          // Calculate total from array of sanction records
          totalSanctionPoints = (sanctionsRes.data as { points: number }[]).reduce(
            (sum, record) => sum + record.points,
            0
          );
        } catch (e) {
          // Sanction records might not be available, use 0
        }

        // Calculate adjusted limits based on sanction points
        const sanctionPenalty = totalSanctionPoints * settings.sanctionHourPenaltyPerPoint;
        const adjustedWeeklyLimit = Math.max(0, settings.maxHoursPerWeek - sanctionPenalty);
        const adjustedDailyLimit = Math.max(0, settings.maxHoursPerDay - sanctionPenalty / 2);

        // Get current week start and end
        const now = new Date();
        const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        // Get today's start and end
        const dayStart = new Date(now);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        // Filter user's reservations for this week and today
        const userReservations = reservations.filter((r) => r.userId === user.id && r.status !== 'OVERTIME');

        const weeklyReservations = userReservations.filter((r) => {
          const start = new Date(r.startTime);
          return start >= weekStart && start < weekEnd;
        });

        const dailyReservations = userReservations.filter((r) => {
          const start = new Date(r.startTime);
          return start >= dayStart && start < dayEnd;
        });

        // Calculate hours
        const calculateHours = (reservations: Reservation[]) => {
          return reservations.reduce((total, r) => {
            const duration = new Date(r.endTime).getTime() - new Date(r.startTime).getTime();
            return total + duration / (1000 * 60 * 60); // Convert to hours
          }, 0);
        };

        const weeklyHours = calculateHours(weeklyReservations);
        const dailyHours = calculateHours(dailyReservations);

        setQuotaInfo({
          weeklyHours,
          dailyHours,
          weeklyLimit: adjustedWeeklyLimit,
          dailyLimit: adjustedDailyLimit,
          weeklyRemaining: Math.max(0, adjustedWeeklyLimit - weeklyHours),
          dailyRemaining: Math.max(0, adjustedDailyLimit - dailyHours),
          isOvertime: weeklyHours >= adjustedWeeklyLimit || dailyHours >= adjustedDailyLimit,
        });
      } catch (error) {
        console.error('Error calculating quota:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateQuota();
  }, [user, reservations]);

  return { quotaInfo, loading };
}
