"use client";

import { Title } from "@/components/Typography/typography";
import "../../styles/global.scss";
import styles from "./maps.module.scss";
import { useEffect, useRef, useState } from "react";
import MapCard from "@/components/MapCard";
import Loading from "@/components/Loading";
import Link from "next/link";
import PrimaryInput from "@/components/PrimaryInput";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import { useDebounce } from "@uidotdev/usehooks";
import _ from "lodash";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Map } from "@prisma/client";
import MapQua from "@/interfaces/mapQua";
import { getUser } from "../actions";

export default function MapsListPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const isInitialMount = useRef(false);
    const isInitialMount2 = useRef(true);

    const [documents, setDocuments] = useState<Map[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [id, setID] = useState<number>(-6.9e6);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pageCount, setPageCount] = useState<number>(1);
    const [pageNum, setPageNum] = useState<number>(1);

    const [minRating, setMinRating] = useState<string>("0");
    const [maxRating, setMaxRating] = useState<string>("60");
    //   const [category, setCategory] = useState<string>("All");
    const [showBanned, setShowBanned] = useState<boolean>(false);
    const [lastSearchTime, setLastSearchTime] = useState<number>(0);
    const [loadTime, setLoadTime] = useState<number>(Date.now());

    let button = <></>;

    useEffect(() => {
        async function getUserData() {
            const user = await getUser();
            setID(user?.user_id ?? -6.9e6);
        }

        getUserData();
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        search(parseInt(params.get("page") ?? "1"));
    }, []);

    button =
        id !== -6.9e6 ? (
            <Link className={styles.addMapButton} href="/add-map">
                + Add Map
            </Link>
        ) : (
            <></>
        );

    async function search(newPageNum?: number) {
        if (Date.now() - lastSearchTime < 1000) return;
        setLoading(true);

        setLastSearchTime(Date.now());

        const params = new URLSearchParams(searchParams);
        if (searchInput) {
            params.set("query", searchInput);
        } else {
            params.delete("query");
        }

        params.set("page", newPageNum ? newPageNum.toString() : "1");

        replace(`${pathname}?${params.toString()}`);

        setDocuments([]);
        const resp = await fetch(
            `/api/maps` +
                SearchParamBuilder({
                    query: searchInput,
                    page: newPageNum || 1,
                })
        ).then(r => r.json());

        setDocuments(resp.maps);
        setPageNum(newPageNum || 1);
        setPageCount(resp.pageCount);
        setLoading(false);
    }

    return (
        <>
            <Loading loadingStatus={loading} />
            <main style={{ pointerEvents: loading ? "none" : "all" }}>
                <Title button={button}>Maps</Title>
                <PrimaryInput
                    value={searchInput}
                    changeValue={setSearchInput}
                    onClick={() => {
                        search(1);
                    }}
                    placeholderText="Enter Map Name Here"
                    searchMode={true}
                    onConfirm={() => {}}
                    onCancel={() => {}}
                />
                <div className={styles.cards}>
                    {documents?.length
                        ? documents.map(doc => (
                              <MapCard
                                  map={doc.mapQua as unknown as MapQua}
                                  rating={doc.totalRating}
                                  category={doc.category}
                                  key={doc.map_id}
                                  clickable
                                  baseline={doc.baseline}
                                  banned={doc.banned}
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
