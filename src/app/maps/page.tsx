"use client";
import { Toaster, toast } from "sonner";

import "../../styles/global.scss";
import styles from "./maps.module.scss";
import { useEffect, useState } from "react";
import MapCard from "@/components/MapCard";
import Link from "next/link";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import _ from "lodash";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Map } from "@prisma/client";
import MapQua from "@/interfaces/mapQua";
import { getUser } from "../actions";
import {
    Button,
    CheckboxCards,
    ChevronDownIcon,
    Container,
    Dialog,
    DropdownMenu,
    Flex,
    Heading,
    Section,
    Separator,
    Skeleton,
    Switch,
    Text,
    TextField,
} from "@radix-ui/themes";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    MagnifyingGlassIcon,
    MixerHorizontalIcon,
    PlusIcon,
    ShuffleIcon,
} from "@radix-ui/react-icons";

export default function MapsListPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [loading, setLoading] = useState<boolean>(true); // Client only state
    const [searchInput, setSearchInput] = useState<string>("");

    const [documents, setDocuments] = useState<Map[]>([]); // State that can be converted to server
    const [id, setID] = useState<number>(-6.9e6);
    const [pageCount, setPageCount] = useState<number>(1);
    const [pageNum, setPageNum] = useState<number>(1);

    const [minRating, setMinRating] = useState<string>(""); // Search filters
    const [maxRating, setMaxRating] = useState<string>("");
    //   const [category, setCategory] = useState<string>("All");
    const [showBanned, setShowBanned] = useState<boolean>(false);
    const [forceRanked, setForceRanked] = useState<boolean>(false);
    const [selectingRandom, setSelectingRandom] = useState<boolean>(false);

    const [categoryArray, setCategoryArray] = useState([
        "rd",
        "hb",
        "mm",
        "rv",
        "ss",
    ]);

    let button = <></>;

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        async function getUserData() {
            const user = await getUser();
            setID(user?.user_id ?? -6.9e6);
        }

        getUserData();
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
                    minRating: minRating || 0,
                    maxRating: maxRating || 60,
                    showBanned: showBanned || false,
                    forceRanked: forceRanked || false,
                    categories: categoryArray,
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

    async function filteredSearch() {
        if (isNaN(Number(minRating))) {
            toast.error("Your minimum rating is not a number.");
            return;
        }
        if (isNaN(Number(maxRating))) {
            toast.error("Your maximum rating is not a number.");
            return;
        }

        if (!categoryArray.length) {
            toast.error("You must select at least one category.");
            return;
        }

        search(1);
    }

    function categoryAddOrRemove(item: string) {
        categoryArray.includes(item)
            ? setCategoryArray(categoryArray.filter(org => org !== item))
            : setCategoryArray([...categoryArray, item]);
    }

    return (
        <Container width="900px" pt="70px">
            <Toaster richColors />
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
                    <Link
                        href="/map/random"
                        onClick={() => setSelectingRandom(true)}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            color="blue"
                            radius="medium"
                            size="3"
                            loading={selectingRandom}
                            style={{ cursor: "pointer", gap: "10px" }}
                        >
                            <ShuffleIcon width="20" height="20" /> Select Random
                        </Button>
                    </Link>
                </Flex>
            </Flex>

            <TextField.Root
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for a map..."
                size="3"
                radius="medium"
                onKeyDown={e => {
                    if (e.key !== "Enter" || e.repeat) return;
                    search();
                }}
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
                            <Dialog.Title size="8" mt="1">
                                Filters
                            </Dialog.Title>
                            <Separator size="4" mb="3" />
                            <Dialog.Description>
                                <Flex>
                                    <Container
                                        flexGrow="1.5"
                                        flexBasis="0"
                                        pr="5"
                                    >
                                        <Flex gap="5">
                                            <TextField.Root
                                                value={minRating}
                                                onChange={e =>
                                                    setMinRating(e.target.value)
                                                }
                                                placeholder="Min Rating"
                                            />
                                            <TextField.Root
                                                value={maxRating}
                                                onChange={e =>
                                                    setMaxRating(e.target.value)
                                                }
                                                placeholder="Max Rating"
                                            />
                                        </Flex>
                                    </Container>
                                    <Separator
                                        orientation={"vertical"}
                                        size="4"
                                    />
                                    <Flex
                                        flexGrow="1"
                                        flexBasis="0"
                                        direction={"column"}
                                        justify={"center"}
                                    >
                                        <Text size="2" mb="1">
                                            Only Show Ranked?{" "}
                                            <Switch
                                                color="green"
                                                checked={forceRanked}
                                                onCheckedChange={() =>
                                                    setForceRanked(!forceRanked)
                                                }
                                            />
                                        </Text>
                                        <Text size="2">
                                            Show Banned?{" "}
                                            <Switch
                                                color="red"
                                                checked={showBanned}
                                                onCheckedChange={() =>
                                                    setShowBanned(!showBanned)
                                                }
                                            />
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Separator my="3" size="4" />
                                <CheckboxCards.Root
                                    size="2"
                                    columns={"3"}
                                    mb="2"
                                    value={categoryArray}
                                >
                                    <CheckboxCards.Item
                                        value={"rd"}
                                        onClick={() =>
                                            categoryAddOrRemove("rd")
                                        }
                                    >
                                        Reading
                                    </CheckboxCards.Item>
                                    <CheckboxCards.Item
                                        value={"hb"}
                                        onClick={() =>
                                            categoryAddOrRemove("hb")
                                        }
                                    >
                                        Hybrid
                                    </CheckboxCards.Item>
                                    <CheckboxCards.Item
                                        value={"mm"}
                                        onClick={() =>
                                            categoryAddOrRemove("mm")
                                        }
                                    >
                                        Memory
                                    </CheckboxCards.Item>
                                </CheckboxCards.Root>
                                <CheckboxCards.Root
                                    size="2"
                                    value={categoryArray}
                                >
                                    <CheckboxCards.Item
                                        value={"rv"}
                                        onClick={() =>
                                            categoryAddOrRemove("rv")
                                        }
                                    >
                                        Reverse
                                    </CheckboxCards.Item>
                                    <CheckboxCards.Item
                                        value={"ss"}
                                        onClick={() =>
                                            categoryAddOrRemove("ss")
                                        }
                                    >
                                        Splitscroll
                                    </CheckboxCards.Item>
                                </CheckboxCards.Root>
                            </Dialog.Description>
                            <Flex gap="3" mt="5" justify="end">
                                <Dialog.Close>
                                    <Button
                                        variant="surface"
                                        color="gray"
                                        radius="large"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Button
                                    variant="surface"
                                    color="red"
                                    radius="large"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setMinRating("");
                                        setMaxRating("");
                                        setShowBanned(false);
                                        setCategoryArray([
                                            "rd",
                                            "hb",
                                            "mm",
                                            "rv",
                                            "ss",
                                        ]);
                                    }}
                                >
                                    Reset Filters
                                </Button>
                                <Dialog.Close>
                                    <Button
                                        radius="large"
                                        variant="solid"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => filteredSearch()}
                                    >
                                        <MagnifyingGlassIcon />
                                        Search
                                    </Button>
                                </Dialog.Close>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                </TextField.Slot>
                <TextField.Slot pr="0">
                    <Button
                        size="3"
                        onClick={() => search()}
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
                {!loading
                    ? documents.map(doc => (
                          <MapCard
                              map={doc.mapQua as unknown as MapQua}
                              rating={doc.totalRating}
                              category={doc.category}
                              key={doc.map_id}
                              clickable
                              baseline={doc.baseline}
                              banned={doc.banned}
                              ranked={doc.ranked}
                          />
                      ))
                    : Array(4)
                          .fill(0)
                          .map((_, idx) => (
                              <Skeleton
                                  width="400px"
                                  height="200px"
                                  style={{ borderRadius: "25px" }}
                                  key={idx}
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
                                    key={idx}
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
