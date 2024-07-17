'use server'
import { redirect } from 'next/navigation'

export default async function Fuck({ params }: { params: { quaver_id: number } }) {
  redirect(`/map/${params.quaver_id}`)

  return <></>
}
