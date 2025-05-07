// components/FollowCardClient.tsx
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const FollowCard = dynamic(() => import("@/components/followCard"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px]" />
})

export default function FollowCardClient() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <FollowCard />
}