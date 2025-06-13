
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {supabase} from 'supabase/supabase';

export const useAdminAccess = () => {
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user || !session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Checking admin access for user:', user.id);
        
        const { data, error } = await supabase
          .rpc('is_current_user_admin');

        console.log('Admin check result:', { data, error });

        if (error) {
          console.error('Error checking admin access:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, session]);

  return { isAdmin, loading };
};
