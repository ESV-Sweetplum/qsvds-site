"use client";

import { Title } from "@/components/Typography/typography";
import "../../styles/global.scss";
import styles from "./maps.module.scss";
import { useEffect, useState } from "react";
import MapCard from "@/components/MapCard";
import Loading from "@/components/Loading";
import Link from "next/link";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import _ from "lodash";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Map } from "@prisma/client";
import MapQua from "@/interfaces/mapQua";
import { getUser } from "../actions";
import { Button, Dialog, TextField } from "@radix-ui/themes";
import {
    MagnifyingGlassIcon,
    MixerHorizontalIcon,
} from "@radix-ui/react-icons";

export default function MapsListPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

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
        setLoading(true);

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
                <TextField.Root
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search for a map, or click on the filter icon to apply filters."
                    size="3"
                    radius="medium"
                >
                    <TextField.Slot>
                        <Dialog.Root>
                            <Dialog.Trigger>
                                <MixerHorizontalIcon
                                    height="16"
                                    width="16"
                                    style={{ cursor: "pointer" }}
                                    color="white"
                                />
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Title size="8">Filters</Dialog.Title>
                            </Dialog.Content>
                        </Dialog.Root>
                    </TextField.Slot>
                    <TextField.Slot pr="0">
                        <Button
                            size="3"
                            onClick={() => search(1)}
                            radius="medium"
                            loading={loading}
                            style={{ gap: "var(--space-1)" }}
                        >
                            <MagnifyingGlassIcon width="20" height="20" />
                            Search
                        </Button>
                    </TextField.Slot>
                </TextField.Root>
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
