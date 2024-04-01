'use client';

import SearchParams from '@/lib/searchParams';
import styles from './navBar.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setUsername(localStorage.getItem('username') ?? '');
  }, []);

  return (
    <div className={styles.navBar}>
      <div className={styles.navigation}>
        <NavLink href='/maps' text='Maps' />
      </div>
      {username ? (
        <div className={styles.dropdown}>
          <div className={styles.login}>{username}</div>
          <div className={styles.downArrow} />
          <div className={styles.dropdownContent}>
            <Link href='/logout'>Logout</Link>
          </div>
        </div>
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
          Login
        </a>
      )}
    </div>
  );
}

interface NavLinkProps {
  href: string;
  text: string;
}

export function NavLink(props: NavLinkProps) {
  return (
    <Link className={styles.link} href={props.href}>
      {props.text}
    </Link>
  );
}
