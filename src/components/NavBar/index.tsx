'use client';

import SearchParams from '@/lib/searchParams';
import styles from './navBar.module.scss';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setUsername(localStorage.getItem('username') ?? '');
  }, []);

  return (
    <div className={styles.navBar}>
      <div className={styles.navigation}>
        <NavLink />
      </div>
      {username ? (
        <div className={styles.login}>{username}</div>
      ) : (
        <a
          href={
            `https://quavergame.com/oauth2/authorize` +
            SearchParams({
              client_id: process.env.NEXT_PUBLIC_QUAVER_CLIENT_ID,
              redirect_uri: 'http://localhost:3000/login',
              response_type: 'code',
            })
          }
          className={styles.login}
        >
          Suck my nuts
        </a>
      )}
    </div>
  );
}

export function NavLink() {
  return <div></div>;
}
