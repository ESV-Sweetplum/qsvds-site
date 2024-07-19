"use client";

import { Title } from "@/components/Typography/typography";
import "../../styles/global.scss";
import styles from "./maps.module.scss";
import { useEffect, useRef, useState } from "react";
import MapCard from "@/components/MapCard";
import MapDocument from "@/interfaces/mapDocument";
import Loading from "@/components/Loading";
import Link from "next/link";
import PrimaryInput from "@/components/PrimaryInput";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import { useDebounce } from "@uidotdev/usehooks";
import _ from "lodash";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function MapsListPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const isInitialMount = useRef(false);
    const isInitialMount2 = useRef(true);

    const [documents, setDocuments] = useState<MapDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [id, setID] = useState<number>(-1e70);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pageCount, setPageCount] = useState<number>(1);
    const [pageNum, setPageNum] = useState<number>(1);

    const [minRating, setMinRating] = useState<string>("0");
    const [maxRating, setMaxRating] = useState<string>("60");
    //   const [category, setCategory] = useState<string>("All");
    const [showBanned, setShowBanned] = useState<boolean>(false);
    const [lastSearchTime, setLastSearchTime] = useState<number>(0);
    const [loadTime, setLoadTime] = useState<number>(Date.now());

    const debounceDelay = 250;

    const debouncedMinRating = useDebounce(minRating, debounceDelay);
    const debouncedMaxRating = useDebounce(maxRating, debounceDelay);
    const debouncedShowBanned = useDebounce(showBanned, debounceDelay);

    const debouncedInput = useDebounce(searchInput, debounceDelay);
    const debouncedPageNum = useDebounce(pageNum, debounceDelay);

    let button = <></>;

    useEffect(() => {
        if (isInitialMount2.current) {
            isInitialMount2.current = false;
            return;
        }
        if (pageNum !== 1) isInitialMount.current = true;

        console.log("search 1");

        search();
    }, [
        debouncedMinRating,
        debouncedMaxRating,
        debouncedShowBanned,
        debouncedInput,
    ]);

    useEffect(() => {
        if (Date.now() - loadTime < 1000) return;
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        search(debouncedPageNum);
    }, [debouncedPageNum]);

    useEffect(() => {
        setID(parseInt(localStorage.getItem("id") as string));
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (!params) return;

        setPageNum(parseInt(params.get("page") ?? "1"));
        setMinRating(params.get("minRating") ?? "0");
        setMaxRating(params.get("maxRating") ?? "60");
        setSearchInput(params.get("query") ?? "");
        setShowBanned(params.get("showBanned") === "true" ? true : false);

        console.log("search 3");

        search(parseInt(params.get("page") ?? "1"));
    }, []);

    button =
        id > -1e69 ? (
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
        if (minRating && minRating !== "0") {
            params.set("minRating", minRating);
        } else {
            params.delete("minRating");
        }
        if (maxRating && maxRating !== "60") {
            params.set("maxRating", maxRating);
        } else {
            params.delete("maxRating");
        }
        if (newPageNum) {
            params.set("page", newPageNum.toString());
        } else {
            params.set("page", "1");
        }
        if (showBanned) {
            params.set("showBanned", `${showBanned}`);
        } else {
            params.delete("showBanned");
        }

        replace(`${pathname}?${params.toString()}`);

        setDocuments([]);
        const resp = await fetch(
            `/api/maps` +
                SearchParamBuilder({
                    query: searchInput,
                    minRating: minRating,
                    maxRating: maxRating,
                    page: newPageNum || 1,
                    showBanned,
                })
        ).then(r => r.json());

        setDocuments(resp.maps);
        setPageNum(newPageNum || 1);
        setPageCount(resp.pageCount);
        // if (!resp.maps.length) setDocuments(tempDocuments);
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
                    {documents?.length
                        ? documents.map(doc => (
                              <MapCard
                                  map={doc.mapQua}
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
                <div className={styles.pageChangerWrapper}>
                    <div
                        className={styles.pageNavigator}
                        onClick={() => {
                            setPageNum(_.clamp(pageNum - 1, 1, pageCount));
                            search(_.clamp(pageNum - 1, 1, pageCount));
                        }}
                    >
                        &lt;&lt;
                    </div>
                    Page
                    <input
                        className={styles.pageChangerInput}
                        type="number"
                        value={pageNum}
                        onChange={e =>
                            setPageNum(
                                _.clamp(parseInt(e.target.value), 1, pageCount)
                            )
                        }
                        onFocus={e => e.target.select()}
                    />{" "}
                    of {pageCount}{" "}
                    <div
                        className={styles.pageNavigator}
                        onClick={() => {
                            setPageNum(_.clamp(pageNum + 1, 1, pageCount));
                            search(_.clamp(pageNum + 1, 1, pageCount));
                        }}
                    >
                        &gt;&gt;
                    </div>
                </div>
            </main>
        </>
    );
}
