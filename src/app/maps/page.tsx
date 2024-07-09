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
import Link from 'next/link';
import User from '@/interfaces/user';
import PrimaryInput from '@/components/PrimaryInput';

export default function Home() {
  const [documents, setDocuments] = useState<MapDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [id, setID] = useState<number>(-1e70);
  const [searchInput, setSearchInput] = useState<string>("")

  let button = <></>;

  useEffect(() => {
    async function getMaps() {
      const resp = await fetch('/api/maps').then((resp) => resp.json());

      setDocuments(resp.docs);
      setLoading(false);
    }

    getMaps();
  }, []);
 
  useEffect(() => {
    // if (typeof window !== 'undefined') {
        setID(parseInt(localStorage.getItem('id') as string));
    //   }
  })

  button = id > -1e69 ? (
    <Link className={styles.addMapButton} href='/add-map'>
      + Add Map
    </Link>
  ) : (
    <></>
  );

  async function search() {
        setLoading(true)
        setDocuments([])
        const resp = await fetch(`/api/maps?query=${searchInput}`).then((resp) => resp.json());
  
        setDocuments(resp.docs);
        setLoading(false);
    }

  return (
    <>
      <Loading loadingStatus={loading} />
      <main>
        <Title button={button}>Maps</Title>
        <PrimaryInput
          value={searchInput}
          changeValue={setSearchInput}
          onClick={search}
          placeholderText='Enter Map Name Here'
          searchMode={true}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
        <div className={styles.cards}>
          {documents.length
            ? documents.map((doc) => (
                <MapCard
                  map={doc.map}
                  rating={doc.rating}
                  letter={doc.category.charAt(0)}
                  key={doc.map.id}
                  clickable
                  baseline={doc.baseline}
                />
              ))
            : Array(6)
                .fill(0)
                .map((_item, idx) => <MapCard key={idx} />)}
        </div>
      </main>
    </>
  );
}
