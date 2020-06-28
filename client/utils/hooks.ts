import React from 'react';
import Router from 'next/router';
import { useStore } from '~/store';

export const useSyncLogout = () => {
  const store = useStore();

  React.useEffect(() => {
    const handleLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        Router.push('/');
        store.auth.setUser(null);
        console.log('sync-logout');
      }
    }

    window.addEventListener('storage', handleLogout);
    console.log('sync-logout-effect');

    return () => {
      window.removeEventListener('storage', handleLogout);
      window.localStorage.removeItem('logout');
    };
  }, [store.auth]);
};
