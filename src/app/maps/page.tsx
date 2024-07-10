"use client";

import { Title } from "@/components/Typography/typography";
import "../../styles/global.scss";
import styles from "./maps.module.scss";
import { useEffect, useState } from "react";
import Map from "@/interfaces/map";
import MapCard from "@/components/MapCard";
import UserRating from "@/interfaces/userRating";
import MapDocument from "@/interfaces/mapDocument";
import Loading from "@/components/Loading";
import Link from "next/link";
import User from "@/interfaces/user";
import PrimaryInput from "@/components/PrimaryInput";
import SearchParams from "@/lib/searchParams";
import { useDebounce } from "@uidotdev/usehooks";

export default function Home() {
  const [documents, setDocuments] = useState<MapDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [id, setID] = useState<number>(-1e70);
  const [searchInput, setSearchInput] = useState<string>("");
  const [pageNum, setPageNum] = useState<number>(1);

  const [minRating, setMinRating] = useState<string>("0");
  const [maxRating, setMaxRating] = useState<string>("60");
  //   const [category, setCategory] = useState<string>("All");
  const [showBanned, setShowBanned] = useState<boolean>(false);

  const debounceDelay = 250;

  const debouncedMinRating = useDebounce(minRating, debounceDelay);
  const debouncedMaxRating = useDebounce(maxRating, debounceDelay);
  const debouncedShowBanned = useDebounce(showBanned, debounceDelay);

  const debouncedInput = useDebounce(searchInput, debounceDelay);

  let button = <></>;

  useEffect(() => {
    async function getMaps() {
      const resp = await fetch("/api/maps").then((resp) => resp.json());

      setDocuments(resp.docs);
      setLoading(false);
    }

    getMaps();
  }, []);

  useEffect(() => {
    search();
  }, [
    debouncedMinRating,
    debouncedMaxRating,
    debouncedShowBanned,
    debouncedInput,
  ]);

  useEffect(() => {
    // if (typeof window !== 'undefined') {
    setID(parseInt(localStorage.getItem("id") as string));
    //   }
  });

  button =
    id > -1e69 ? (
      <Link className={styles.addMapButton} href="/add-map">
        + Add Map
      </Link>
    ) : (
      <></>
    );

  async function search(startAfter?: number, endBefore?: number) {
    setLoading(true);

    const tempDocuments = [...documents];

    setDocuments([]);
    const resp = await fetch(
      `/api/maps` +
        SearchParams({
          query: searchInput,
          minRating: minRating,
          maxRating: maxRating,
          startAfter: startAfter ?? "",
          endBefore: endBefore ?? "",
          showBanned,
        })
    ).then((resp) => resp.json());

    setDocuments(resp.docs);
    if (!resp.docs.length && (startAfter || endBefore))
      setDocuments(tempDocuments);
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
          placeholderText="Enter Map Name Here"
          searchMode={true}
          onConfirm={() => {}}
          onCancel={() => {}}
          displayDropdown
          minRating={minRating}
          maxRating={maxRating}
          showBanned={showBanned}
          setMinRating={setMinRating}
          setMaxRating={setMaxRating}
          setShowBanned={setShowBanned}
          hideSearch
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
                  banned={doc.banned}
                />
              ))
            : Array(6)
                .fill(0)
                .map((_item, idx) => <MapCard key={idx} />)}
        </div>
        <div className={styles.pageChangerWrapper}>
          <div
            className={styles.pageChanger}
            onClick={() =>
              pageNum > 1 ? search(undefined, documents[0].timeAdded) : {}
            }
          >
            Go to Previous Page
          </div>
          <div className={styles.separator} />
          <div
            className={styles.pageChanger}
            onClick={() => {
              search(documents[documents.length - 1].timeAdded, undefined);
              setPageNum(pageNum + 1);
            }}
          >
            Go to Next Page
          </div>
        </div>
      </main>
    </>
  );
}
