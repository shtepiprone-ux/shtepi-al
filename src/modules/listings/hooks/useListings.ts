'use client'

import { useEffect, useState } from 'react'
import { getFeaturedListings, getLatestListings } from '@/modules/listings/lib/queries'

export function useFeaturedListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedListings()
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { listings, loading }
}

export function useLatestListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatestListings()
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { listings, loading }
}
