'use client';

import '../../styles/global.scss';
import styles from './addMap.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import PrimaryInput from '@/components/PrimaryInput';
import ErrorMessage from '@/components/ErrorMessage';
import Map from '@/interfaces/map';
import Loading from '@/components/Loading';
import InputCard from '@/components/InputCard';
import MapCard from '@/components/MapCard';
import { Title } from '@/components/Typography/typography';

export default function Home() {
  const router = useRouter();

  const [mapIDInput, setMapIDInput] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [map, setMap] = useState<Partial<Map>>({});
  const [rating, setRating] = useState<string>('0');
  const [category, setCategory] = useState<string>('Reading');

  async function search() {
    const input = mapIDInput
      .replace('quavergame.com/mapset/map/', '')
      .replace('https://', '')
      .replace('http://', '');
    if (input !== parseInt(input).toString()) {
      console.log(input);
      console.log(parseInt(input).toString());
      throwError('Invalid Map ID or URL.');
      return;
    }

    try {
      setLoading(true);

      const existingDoc = (
        await fetch(`/api/map?id=${input}`).then((resp) => resp.json())
      ).data;

      if (existingDoc.rating) {
        throwError('This map was already added.');
        return;
      }

      const resp = await fetch(
        `https://api.quavergame.com/v1/maps/${input}`
      ).then((resp) => resp.json());
      if (resp.status !== 200) {
        switch (resp.status) {
          case 404:
            throwError("A map with that ID doesn't exist.");
            break;
          default:
            throwError(`An unknown error occurred. (${resp.status})`);
            break;
        }
        return;
      }
      if (resp.map.mapset_id === -1) {
        throwError(`This map no longer exists.`);
        return;
      }
      setMap(resp.map);
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) throwError(e.message);
      else if (typeof e === 'string') throwError(e);
    } finally {
      setLoading(false);
    }
  }

  async function throwError(msg: string, time: number = 3000) {
    setErrorMessage(msg);
    setErrorStatus(true);
    await sleep(time);
    setErrorStatus(false);
  }

  async function submitRating() {
    setLoading(true);
    try {
      const resp = await fetch('/api/map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          map,
          user_id: localStorage.getItem('id'),
          rating,
          category,
        }),
      });
      const data = await resp.json();
      console.log(data);
      setMap({});
      setMapIDInput('');
      setRating('0');
      setCategory('Reading');
    } catch (e) {
      const error = e as string;
      throwError(error);
    }
    setLoading(false);
  }

  async function cancelRating() {
    setMap({});
  }

  useEffect(() => {
    if (!localStorage.getItem('id')) router.push('/maps');
  }, []);

  if (!localStorage.getItem('id')) return <></>;

  return (
    <>
      <Loading loadingStatus={loading} />
      <ErrorMessage errorText={errorMessage} errorTriggered={errorStatus} />
      <main
        style={
          loading
            ? {
                transition: 'filter 0.5s',
                filter: 'brightness(0.25)',
                pointerEvents: 'none',
              }
            : { transition: 'filter 0.5s', filter: 'brightness(1)' }
        }
      >
        <Title>Add Map and Rating</Title>
        <PrimaryInput
          value={mapIDInput}
          changeValue={setMapIDInput}
          onClick={search}
          placeholderText='Enter Quaver Map Link or ID Here'
          searchMode={typeof map.id !== 'number'}
          onConfirm={submitRating}
          onCancel={cancelRating}
        />
        <div className={styles.cards}>
          {map.id ? (
            <MapCard
              map={map}
              rating={rating}
              letter={category.charAt(0)}
              scale={1.25}
            />
          ) : (
            <MapCard emptyText='Add Map First' scale={1.25} />
          )}
          <InputCard
            title='Rating'
            rating={rating}
            setRating={setRating}
            category={category}
            setCategory={setCategory}
            clamp={[0, 60]}
          />
        </div>
      </main>
    </>
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
