'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import '../../styles/global.scss';
import { useEffect, useState } from 'react';
import User from '@/interfaces/user';
import GenerateHash from '@/lib/generateHash';

export default function Home() {
  const [loadingText, setText] = useState<string>('Logging you in...');
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get('code');

    async function main() {
      setText('Accessing user token...');
      const resp = await fetch('/api/user-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      }).then((resp) => resp.json());

      if (!resp.data) router.push('/');

      const user = resp.data.user;
      setText('Fetching user status...');

      let existingUser = await fetch(`/api/user?id=${resp.data.user.id}`).then(
        (resp) => resp.json()
      );

      console.log(existingUser);

      if (existingUser.status === 200) {
        setText('Done!');
        setLocalStorage(existingUser.data);
        router.push('/');
        return;
      }

      const userData: User = {
        id: existingUser.highestID + 1,
        quaver_id: user.id,
        username: user.username,
        avatar: user.avatar,
        hash: GenerateHash(user.id),
      };

      setText('Generating new user...');

      const userUpload = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }).then((resp) => resp.json());

      setText('Done!');
      setLocalStorage(userData);
      router.push(`/user/${userData.id}`);
    }

    main();
  }, [router]);

  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        color: 'white',
        fontSize: '5rem',
        zIndex: '69',
        display: 'grid',
        placeItems: 'center',
        textShadow: '2px 2px 5px black',
      }}
    >
      {loadingText}
    </div>
  );
}

function setLocalStorage(user: User) {
  localStorage.setItem('id', user.id.toString());
  localStorage.setItem('username', user.username);
  localStorage.setItem('quaver_id', user.quaver_id.toString());
  localStorage.setItem('avatar', user.avatar);
  localStorage.setItem('hash', user.hash);
}
