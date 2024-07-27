"use client";

import { useEffect, useState } from "react";
import "../../styles/global.scss";
import styles from "./admin.module.scss";
import { Title } from "@/components/Typography/typography";
import { Textfit } from "react-textfit";
import Loading from "@/components/Loading";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import { useRouter } from "next/navigation";
import { Category, Map, User } from "@prisma/client";
import MapQua from "@/interfaces/mapQua";
import { getUser, userIsAdmin } from "../actions";

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<User>();

    const [docs, setDocs] = useState<Map[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getMaps() {
            const isAdmin = await userIsAdmin();

            if (!isAdmin) {
                router.push("/");
                return;
            }

            const user = await getUser();
            setUser(user);

            const resp = await fetch(
                `/api/maps` +
                    SearchParamBuilder({
                        limited: false,
                        quaver_id: user?.quaver_id,
                        hash: user?.hash,
                    })
            ).then(r => r.json());

            setDocs(resp.maps);
            setCategories(resp.maps.map((doc: Map) => doc.category));
            setLoading(false);
        }

        getMaps();
    }, []);

    async function changeCategory(id: number, idx: number, category: string) {
        setLoading(true);
        const tempCategories = [...categories];
        tempCategories[idx] = category;

        setCategories(tempCategories);

        const tempDocs = [...docs];
        tempDocs[idx].category = category as Category;

        setDocs(tempDocs);

        const resp = await fetch(`/api/category`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                category,
                user_id: user?.user_id,
                hash: user?.hash,
            }),
        }).then(r => r.json());

        setLoading(false);
    }

    return (
        <>
            <Loading loadingStatus={loading} />
            <main
                style={{
                    opacity: 1 - +loading * 0.5,
                    pointerEvents: loading ? "none" : "all",
                }}
            >
                <Title>Admin</Title>
                {docs.map((doc, docIdx) =>
                    (doc.mapQua as unknown as MapQua) ? (
                        <div className={styles.mapDoc} key={docIdx}>
                            <div className={styles.id}>{doc.map_id}</div>
                            <div className={styles.separator}></div>
                            <div className={styles.quaver_id}>
                                {(doc.mapQua as unknown as MapQua).id}
                            </div>
                            <div className={styles.separator}></div>
                            <div className={styles.title}>
                                <Textfit mode="single" max={12}>
                                    {(doc.mapQua as unknown as MapQua).title}
                                </Textfit>
                            </div>
                            <div className={styles.separator}></div>
                            <div className={styles.diffName}>
                                <Textfit mode="single" max={12}>
                                    {
                                        (doc.mapQua as unknown as MapQua)
                                            .difficulty_name
                                    }
                                </Textfit>
                            </div>
                            <div className={styles.separator}></div>
                            <div className={styles.creator}>
                                {
                                    (doc.mapQua as unknown as MapQua)
                                        .creator_username
                                }
                            </div>
                            <div className={styles.separator}></div>
                            <select
                                className={styles.category}
                                onChange={e =>
                                    changeCategory(
                                        doc.map_id,
                                        docIdx,
                                        e.target.value
                                    )
                                }
                                value={doc.category}
                            >
                                {[
                                    "Reading",
                                    "Hybrid",
                                    "Memory",
                                    "Reverse",
                                    "Splitscroll",
                                ].map((item, idx) => (
                                    <option value={item} key={idx}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <></>
                    )
                )}
            </main>
        </>
    );
}
