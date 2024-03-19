'use client';

import { Title } from '@/components/Typography/typography';
import '../../styles/global.scss';
import styles from './maps.module.scss';
import { useEffect, useState } from 'react';
import Map from '@/interfaces/map';
import MapCard from '@/components/MapCard';
import UserRating from '@/interfaces/userRating';
import MapDocument from '@/interfaces/mapDocument';
import Loading from '@/components/Loading';

export default function Home() {
  const [documents, setDocuments] = useState<MapDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getMaps() {
      const resp = await fetch('/api/maps').then((resp) => resp.json());
      setDocuments(resp.docs);
      setLoading(false);
    }

    getMaps();
  }, []);

  return (
    <>
      <Loading loadingStatus={loading} />
      <main>
        <Title>Maps</Title>
        <div className={styles.cards}>
          {documents.length
            ? documents.map((doc) => (
                <MapCard
                  map={doc.map}
                  rating={doc.rating}
                  letter={doc.category.charAt(0)}
                  key={doc.map.id}
                />
              ))
            : Array(6)
                .fill(0)
                .map((item) => <MapCard key={item} />)}
        </div>
      </main>
    </>
  );
}
