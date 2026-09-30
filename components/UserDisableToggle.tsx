'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { setUserDisabled } from '@/lib/actions/admin.actions';
import { useToast } from '@/hooks/use-toast';

const UserDisableToggle = ({
  userId,
  disabled,
}: {
  userId: string;
  disabled: boolean;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async () => {
    setIsLoading(true);
    try {
      await setUserDisabled({ userId, disabled: !disabled });
    } catch {
      toast({
        description: 'Failed to update user.',
        className: 'error-toast',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={disabled ? 'outline' : 'destructive'}
      disabled={isLoading}
      onClick={toggle}
    >
      {disabled ? 'Enable' : 'Disable'}
    </Button>
  );
};

export default UserDisableToggle;
