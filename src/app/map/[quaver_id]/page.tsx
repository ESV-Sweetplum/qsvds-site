"use client";

import styles from "./map.module.scss";
import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import "../../../styles/global.scss";
import { useEffect, useState } from "react";
import MapQua from "@/interfaces/mapQua";
import Loading from "@/components/Loading";
import RatingDisplay from "@/components/RatingDisplay";
import _ from "lodash";
import { Textfit } from "react-textfit";
import { Category, Quality, Rating, Score, User } from "@prisma/client";
import { getUser } from "@/app/actions";
import {
    Button,
    ChevronDownIcon,
    DropdownMenu,
    Flex,
    Text,
} from "@radix-ui/themes";

export default function MapPage({ params }: { params: { quaver_id: number } }) {
    const router = useRouter();

    const [map, setMap] = useState<Partial<MapQua>>({});
    const [totalRating, setTotalRating] = useState<number>(0);
    const [submittedRating, setSubmittedRating] = useState<string>("-1");
    const [userRating, setUserRating] = useState<string>("-1");
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [scores, setScores] = useState<Score[]>([]);
    const [category, setCategory] = useState<Category | "">("");

    const [quality, setQuality] = useState<Quality | "">("");

    const [loading, setLoading] = useState<boolean>(true);
    const [submittingRating, setSubmittingRating] = useState<boolean>(false);

    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function getMap() {
            const user = await getUser();
            setUser(user);

            const resp = await fetch(
                `/api/map?quaver_id=${params.quaver_id}`
            ).then(r => r.json());
            const resp2 = await fetch(
                `/api/ratings?map_quaver_id=${params.quaver_id}`
            ).then(r => r.json());
            const resp3 = await fetch(
                `/api/scores?map_quaver_id=${params.quaver_id}`
            ).then(r => r.json());

            console.log(resp3);

            const userRatingDoc = resp2.ratings.filter(
                (r: Rating) => r.user_id === user?.user_id ?? "-6.9e6"
            )[0];

            setUserRating(userRatingDoc?.rating ?? "-1");

            setTotalRating(resp.map.totalRating);
            setSubmittedRating(userRating);
            setCategory(resp.map.category);
            setRatings(resp2.ratings);
            setScores(resp3.scores);
            setMap(resp.map.mapQua);
            setLoading(false);
            setQuality(userRatingDoc?.quality ?? "Decent");
        }

        getMap();
    }, []);

    async function submitRating() {
        if (parseInt(userRating) <= 0) return;

        setSubmittingRating(true);
        const resp = await fetch("/api/rating", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user?.user_id,
                quaver_id: user?.quaver_id,
                hash: user?.hash,
                rating: userRating,
                map_id: map.id,
                quality,
            }),
        }).then(r => r.json());

        if (resp.status !== 200) {
            console.log(resp);
            setSubmittingRating(false);
            return;
        }

        setSubmittedRating(userRating);
        setTotalRating(resp.newTotalRating);
        setRatings(resp.newRatings);
        setSubmittingRating(false);
    }

    return (
        <>
            <Loading loadingStatus={loading || submittingRating} />
            <main
                style={{
                    opacity: +!loading,
                    transition: "opacity 0.3s",
                    pointerEvents: submittingRating || loading ? "none" : "all",
                }}
            >
                <div className={styles.bannerImage}>
                    <Image
                        src={`https://cdn.quavergame.com/mapsets/${map.mapset_id}.jpg`}
                        alt={`banner`}
                        fill
                        style={{ objectFit: "cover", filter: "blur(5px)" }}
                    />
                </div>
                <div className={styles.bannerText}>
                    <Textfit mode="single" max={48}>
                        {map.artist} - {map.title}
                    </Textfit>
                    <Textfit mode="single" max={32}>
                        By: {map.creator_username} - [{map.difficulty_name}] (
                        {map.difficulty_rating?.toFixed(2)})
                    </Textfit>
                </div>

                <div className={styles.ratingCard}>
                    <div className={styles.ratingStatsSection}>
                        <div className={styles.totalRatingDisplay}>
                            <div>
                                <RatingDisplay
                                    rating={totalRating}
                                    category={category}
                                    range={[0, 60]}
                                    style={{
                                        zIndex: 69,
                                        opacity: 1,
                                        position: "relative",
                                        margin: 0,
                                    }}
                                    scale={0.7}
                                />
                            </div>
                            from {ratings.length} rating
                            {ratings.length >= 2 ? "s" : ""}
                        </div>
                        <div className={styles.ratingHistogram}></div>
                    </div>
                    {user ? (
                        <>
                            <div className={styles.ratingAddSection}>
                                Your Rating -{" "}
                                {submittedRating === "-1"
                                    ? "NONE"
                                    : submittedRating}
                                <input
                                    type="number"
                                    value={
                                        userRating === "-1" ? "0" : userRating
                                    }
                                    onChange={e =>
                                        setUserRating(
                                            _.clamp(
                                                parseInt(e.target.value) || 0,
                                                0,
                                                60
                                            ).toString()
                                        )
                                    }
                                />
                                <Flex align={"center"} gap={"3"}>
                                    <Text size="4">Select Quality:</Text>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger>
                                            <Button
                                                variant="surface"
                                                color="gray"
                                            >
                                                {quality} <ChevronDownIcon />
                                            </Button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            {[
                                                "Bad",
                                                "Decent",
                                                "Great",
                                                "Brilliant",
                                            ].map(qual => (
                                                <DropdownMenu.Item
                                                    onClick={() =>
                                                        setQuality(
                                                            qual as Quality
                                                        )
                                                    }
                                                    // key={qual}
                                                >
                                                    {qual}
                                                </DropdownMenu.Item>
                                            ))}
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </Flex>
                                <button
                                    className={styles.ratingSubmitButton}
                                    onClick={submitRating}
                                >
                                    submit LOL
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.ratingAddSection}>
                            log in bruh
                        </div>
                    )}
                </div>
                <div className={styles.ratingList}>
                    {ratings.map(rating => (
                        <div className={styles.rating} key={rating.user_id}>
                            Rating - {rating.user_id} - {rating.rating}
                        </div>
                    ))}
                    {scores.map(score => (
                        <div className={styles.rating} key={score.user_id}>
                            Score - {score.user_id} -{" "}
                            {score.accuracy.toFixed(2)}
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
