'use client'

import styles from "./users.module.scss"
import "../../styles/global.scss"
import User from '@/interfaces/user'
import { useEffect, useState } from 'react'
import UserCard from '@/components/UserCard'
import { Title } from '@/components/Typography/typography'
import PrimaryInput from '@/components/PrimaryInput'
import SearchParamBuilder from '@/lib/searchParamBuilder'
import Loading from '@/components/Loading'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("")

  useEffect(() => {
    search()
  }, [])

  async function search() {
    setLoading(true)
    const queryBuilder: Record<string, any> = {
      includeRatings: true
    }
    if (searchInput) queryBuilder.query = searchInput
    const resp = await fetch(`/api/users`+SearchParamBuilder(queryBuilder)).then((r) => r.json())
    setUsers(resp.users)
    setLoading(false)
  }

  return <>
      <Loading loadingStatus={loading} />
      <main style={{pointerEvents: loading ? "none" : "all"}}>
      <Title>Users</Title>
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
}
