import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (user?.role === 'customer') {
        console.log('going to customer')
      router.replace('/customer');
    } else if (user?.role === 'courier') {
      router.replace('/courier');
    }
  }, [user, isLoading]);

  return null;
}