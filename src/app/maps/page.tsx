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
import {
    Button,
    Container,
    Dialog,
    DropdownMenu,
    Flex,
    Heading,
    Section,
    Skeleton,
    Text,
    TextField,
} from "@radix-ui/themes";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    DropdownMenuIcon,
    MagnifyingGlassIcon,
    MixerHorizontalIcon,
    PlusIcon,
    ShuffleIcon,
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
    const [selectingRandom, setSelectingRandom] = useState<boolean>(false);

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

    const router = useRouter();
    function ChangePage(
        desiredPage: number,
        currentPage: number,
        pageCount: number
    ): void {
        const newPage = _.clamp(desiredPage, 1, pageCount);

        if (newPage === currentPage) return;

        router.push(`/maps?page=${newPage}`);
        setPageNum(newPage);
        search(newPage);
    }

    return (
        <Container width="900px" pt="70px">
            <Flex align="center" justify="between" mt="8" mb="6">
                <Heading size="8">Maps</Heading>
                <Flex gap="3">
                    {id !== -6.9e6 ? (
                        <Button color="grass" radius="medium" size="3" asChild>
                            <Link href="/add-map">
                                <PlusIcon width="20" height="20" /> Add Map
                            </Link>
                        </Button>
                    ) : (
                        <></>
                    )}
                    <Button
                        color="blue"
                        radius="medium"
                        size="3"
                        loading={selectingRandom}
                        // asChild
                    >
                        <Link
                            href="/map/random"
                            onClick={() => setSelectingRandom(true)}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <ShuffleIcon width="20" height="20" /> Select Random
                        </Link>
                    </Button>
                </Flex>
            </Flex>

            <TextField.Root
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for a map..."
                size="3"
                radius="medium"
            >
                <TextField.Slot>
                    <Dialog.Root>
                        <Dialog.Trigger>
                            <MagnifyingGlassIcon
                                height="16"
                                width="16"
                                // style={{ cursor: "pointer" }}
                                color="white"
                            />
                        </Dialog.Trigger>
                        <Dialog.Content>
                            <Dialog.Title size="8">Filters</Dialog.Title>
                            <Dialog.Description>
                                Radix makes me wanna kms (i will do this
                                eventually) (also don't forget to replace the
                                search icon with a filter icon you bozo)
                            </Dialog.Description>
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
                    : Array(4)
                          .fill(0)
                          .map(_ => (
                              <Skeleton
                                  width="400px"
                                  height="200px"
                                  style={{ borderRadius: "25px" }}
                              />
                          ))}
            </div>
            <Section className={styles.pageNavigator}>
                <DoubleArrowLeftIcon
                    onClick={() => ChangePage(1, pageNum, pageCount)}
                />
                <ChevronLeftIcon
                    onClick={() => ChangePage(pageNum - 1, pageNum, pageCount)}
                />
                <Text>Page</Text>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button size="1" radius="large" variant="surface">
                            {pageNum}
                            <ChevronUpIcon />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {Array(pageCount)
                            .fill(-1)
                            .map((_, idx) => (
                                <DropdownMenu.Item
                                    onClick={() =>
                                        ChangePage(idx + 1, pageNum, pageCount)
                                    }
                                >
                                    {idx + 1}
                                </DropdownMenu.Item>
                            ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Text>of {pageCount}</Text>
                <ChevronRightIcon
                    onClick={() => ChangePage(pageNum + 1, pageNum, pageCount)}
                />
                <DoubleArrowRightIcon
                    onClick={() => ChangePage(pageCount, pageNum, pageCount)}
                />
            </Section>
        </Container>
    );
}
