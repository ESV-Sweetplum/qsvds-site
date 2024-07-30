"use client";

import styles from "./user.module.scss";
import Image from "next/image";

import { useRouter } from "next/navigation";
import "../../../styles/global.scss";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import _ from "lodash";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import { Title } from "@/components/Typography/typography";
import MapCard from "@/components/MapCard";
import { Prisma, User } from "@prisma/client";
import MapQua from "@/interfaces/mapQua";

const monthArr =
    "January February March April May June July August September October November December".split(
        " "
    );

export default function MapPage({ params }: { params: { id: number } }) {
    const router = useRouter();

    const [user, setUser] = useState<
        Partial<
            Prisma.UserGetPayload<{
                include: { ratings: { include: { map: true } } };
            }>
        >
    >({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getUser() {
            const resp = await fetch(
                "/api/user" +
                    SearchParamBuilder({
                        user_id: params.id,
                        includeRatings: true,
                    })
            ).then(r => r.json());

            setUser(resp.user);

            console.log(resp.user);
            setLoading(false);
        }

        getUser();
    }, []);

    return (
        <>
            <Loading loadingStatus={loading} />
            <main
                style={{
                    opacity: +!loading,
                    transition: "opacity 0.3s",
                    pointerEvents: loading ? "none" : "all",
                }}
            >
                {user ? (
                    <>
                        <div className={styles.userInfo}>
                            <div className={styles.userImage}>
                                <Image
                                    src={user.avatar || ""}
                                    alt={`${user.username}'s PFP`}
                                    fill
                                />
                            </div>
                            <div className={styles.userText}>
                                <div className={styles.username}>
                                    {user.username}
                                </div>
                                <div
                                    style={{
                                        fontSize: "2rem",
                                        marginTop: "20px",
                                    }}
                                >
                                    Joined on{" "}
                                    {
                                        monthArr[
                                            new Date(
                                                user.createdAt || ""
                                            ).getMonth()
                                        ]
                                    }{" "}
                                    {new Date(user.createdAt || "").getDay() +
                                        1}
                                    ,{" "}
                                    {new Date(
                                        user.createdAt || ""
                                    ).getFullYear()}
                                </div>
                                <div style={{ fontSize: "1.5rem" }}>
                                    Submitted {user.ratings?.length} Ratings
                                </div>
                            </div>
                        </div>
                        <Title>Submitted Ratings</Title>
                        <div className={styles.mapGrid}>
                            {user.ratings?.length ? (
                                user.ratings?.map((rating, idx) => {
                                    if (!rating.map) return <></>;

                                    return (
                                        <MapCard
                                            key={idx}
                                            map={
                                                rating.map
                                                    .mapQua as unknown as MapQua
                                            }
                                            rating={rating.rating}
                                            category={rating.map.category}
                                            clickable
                                            baseline={rating.map.baseline}
                                            banned={rating.map.banned}
                                            ranked={rating.map.ranked}
                                        />
                                    );
                                })
                            ) : (
                                <>NO RATINGS SUBMITTED</>
                            )}
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </main>
        </>
    );
}
