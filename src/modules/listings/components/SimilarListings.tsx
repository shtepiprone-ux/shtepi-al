'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { ListingCard } from '@/modules/listings/components/ListingCard'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  currentId: string
  propertyType: string
  locationId: number | null
}

export function SimilarListings({ currentId, propertyType, locationId }: Props) {
  const t = useTranslations('listing')
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let query = supabase
      .from('listings')
      .select(`id, slug, title, price, price_old, currency, listing_type, property_type,
        rooms, bedrooms, bathrooms, area_gross, floor, is_premium, status, created_at,
        location:locations(id, name_al, slug, type),
        images:listing_images(url, is_cover, order)`)
      .eq('status', 'active')
      .eq('property_type', propertyType)
      .neq('id', currentId)
      .gte('expires_at', new Date().toISOString())
      .limit(4)

    if (locationId) query = query.eq('location_id', locationId)

    query.then(({ data }) => {
      setListings(data ?? [])
      setLoading(false)
    })
  }, [currentId, propertyType, locationId])

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-3 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-5 w-32" /></div>
        </div>
      ))}
    </div>
  )

  if (!listings.length) return null

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">{t('similar_listings')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  )
}
