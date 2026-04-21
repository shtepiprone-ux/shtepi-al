'use client'

import { useEffect, useState } from 'react'
import { getSearchableLocations } from '@/modules/locations/lib/queries'
import type { Location } from '@/types/database'

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSearchableLocations()
      .then(setLocations)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { locations, loading }
}
