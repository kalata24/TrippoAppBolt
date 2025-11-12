import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import ConfirmModal from '@/components/ConfirmModal';

export default function Logout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setShowConfirm(true);
  }, []);

  const handleLogout = async () => {
    setShowConfirm(false);
    await signOut();
    router.replace('/(auth)/welcome');
  };

  const handleCancel = () => {
    setShowConfirm(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ConfirmModal
        visible={showConfirm}
        title="Log Out"
        message="Are you sure you want to log out? You'll need to sign in again to access your trips."
        confirmText="Log Out"
        cancelText="Stay"
        onConfirm={handleLogout}
        onCancel={handleCancel}
        isDangerous
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
