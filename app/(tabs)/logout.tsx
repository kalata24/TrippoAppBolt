import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

export default function Logout() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.replace('/(auth)/welcome');
    };

    handleLogout();
  }, []);

  return null;
}
