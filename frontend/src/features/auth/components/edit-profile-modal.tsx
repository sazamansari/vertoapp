'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useEditProfileModal } from '@/features/auth/hooks/use-edit-profile-modal';
import { EditProfileForm } from './edit-profile-form';

export const EditProfileModal = () => {
  const { isOpen, setIsOpen, close } = useEditProfileModal();

  return (
    <ResponsiveModal title="User Profile Settings" description="Update your personal display settings." open={isOpen} onOpenChange={setIsOpen}>
      <EditProfileForm onCancel={close} />
    </ResponsiveModal>
  );
};
