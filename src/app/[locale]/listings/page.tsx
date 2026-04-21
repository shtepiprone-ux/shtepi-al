import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { ListingsShell } from '@/modules/listings/components/ListingsShell'
import { LISTINGS_PER_PAGE } from '@/modules/listings/constants'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'listing' })
  return {
    title: `${t('listings_page_title')} | Shtepi.al`,
  }
}

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] : v ?? ''
}

function num(v: string): number | undefined {
  const n = parseInt(v)
  return isNaN(n) ? undefined : n
}

export default async function ListingsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'listing' })

  const listingType = str(sp.type)
  const propertyType = str(sp.property_type)
  const locationId = num(str(sp.location_id))
  const priceMin = num(str(sp.price_min))
  const priceMax = num(str(sp.price_max))
  const areaMin = num(str(sp.area_min))
  const areaMax = num(str(sp.area_max))
  const rooms = num(str(sp.rooms))
  const condition = str(sp.condition)
  const heating = str(sp.heating)
  const sort = str(sp.sort) || 'newest'
  const page = Math.max(1, num(str(sp.page)) ?? 1)
  const from = (page - 1) * LISTINGS_PER_PAGE
  const to = from + LISTINGS_PER_PAGE - 1

  const supabase = await createClient()

  const LISTING_SELECT = `
    id, slug, title, price, price_old, currency, listing_type, property_type,
    rooms, bedrooms, bathrooms, area_gross, floor, is_premium, status, created_at,
    location:locations(id, name_al, slug, type),
    images:listing_images(url, is_cover, order)
  `

  let query = supabase
    .from('listings')
    .select(LISTING_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())

  if (listingType) query = query.eq('listing_type', listingType as any)
  if (propertyType) query = query.eq('property_type', propertyType as any)
  if (locationId) query = query.eq('location_id', locationId)
  if (priceMin) query = query.gte('price', priceMin)
  if (priceMax) query = query.lte('price', priceMax)
  if (areaMin) query = query.gte('area_gross', areaMin)
  if (areaMax) query = query.lte('area_gross', areaMax)
  if (rooms) query = query.gte('rooms', rooms)
  if (condition) query = query.eq('condition', condition as any)
  if (heating) query = query.eq('heating', heating as any)

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'area_desc') query = query.order('area_gross', { ascending: false })
  else {
    query = query.order('is_premium', { ascending: false })
    query = query.order('created_at', { ascending: false })
  }

  const { data: listings, count, error } = await query.range(from, to)

  if (error) {
    console.error('Failed to fetch listings', { error, searchParams: sp })
  }

  const { data: locations } = await supabase
    .from('locations')
    .select('id, name_al, type')
    .in('type', ['region', 'city'])
    .order('name_al')

  const total = count ?? 0

  const activeFiltersCount = [listingType, propertyType, locationId, priceMin, priceMax,
    areaMin, areaMax, rooms, condition, heating].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
              {t('all_listings').split(' ')[0]}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t('listings_page_title')}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ListingsShell
          listings={listings ?? []}
          total={total}
          page={page}
          locations={locations ?? []}
          activeFiltersCount={activeFiltersCount}
        />
      </div>
    </div>
  )
}
