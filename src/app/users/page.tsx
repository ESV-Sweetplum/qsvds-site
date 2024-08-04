"use client";

import styles from "./users.module.scss";
import "../../styles/global.scss";
import { useEffect, useState } from "react";
import UserCard from "@/components/UserCard";
import PrimaryInput from "@/components/client/add-map/PrimaryInput";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import Loading from "@/components/shared/Loading";
import { Prisma } from "@prisma/client";
import { Heading } from "@radix-ui/themes";

export default function UsersPage() {
    const [users, setUsers] = useState<
        Prisma.UserGetPayload<{ include: { ratings: true } }>[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchInput, setSearchInput] = useState<string>("");

    useEffect(() => {
        search();
    }, []);

    async function search() {
        setLoading(true);
        const queryBuilder: Record<string, any> = {
            includeRatings: true,
        };
        if (searchInput) queryBuilder.query = searchInput;
        const resp = await fetch(
            `/api/users` + SearchParamBuilder(queryBuilder)
        ).then(r => r.json());
        setUsers(resp.users);
        setLoading(false);
    }

    return (
        <>
            <Loading loadingStatus={loading} />
            <main style={{ pointerEvents: loading ? "none" : "all" }}>
                <Heading size="8" my="6">
                    Users
                </Heading>
                <PrimaryInput
                    value={searchInput}
                    changeValue={setSearchInput}
                    onClick={search}
                    placeholderText="Enter Username Here"
                    searchMode={true}
                    onConfirm={() => {}}
                    onCancel={() => {}}
                    // hideSearch
                />
                {users.map((user, idx) => (
                    <UserCard user={user} key={idx} />
                ))}
            </main>
        </>
    );
}
