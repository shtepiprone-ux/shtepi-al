import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { MapPin, Eye, CalendarDays, Home, BedDouble, Bath, Maximize2, Layers, Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ListingGallery } from '@/modules/listings/components/ListingGallery'
import { ListingContact } from '@/modules/listings/components/ListingContact'
import { SimilarListings } from '@/modules/listings/components/SimilarListings'
import { MapWrapper } from '@/components/shared/MapWrapper'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('listings').select('title, description, price, currency').eq('slug', slug).single()
  if (!data) return {}
  return {
    title: `${data.title} | Shtepi.al`,
    description: data.description?.slice(0, 160),
  }
}

function formatPrice(price: number, currency: string) {
  return `${new Intl.NumberFormat('sq-AL').format(price)} ${currency}`
}

export default async function ListingPage({ params }: Props) {
  const { slug, locale } = await params
  const t = await getTranslations('listing')

  const supabase = await createClient()
  const { data: listing } = await supabase
    .from('listings')
    .select(`*, location:locations(id, name_al, slug, type), images:listing_images(url, is_cover, "order"), owner:users!listings_user_id_fkey(id, name, phone, whatsapp, avatar_url, user_type, is_verified, company_name)`)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!listing) notFound()

  const owner = Array.isArray(listing.owner) ? listing.owner[0] : listing.owner
  const images = listing.images ?? []
  const pricePerSqm = listing.area_gross ? Math.round(listing.price / listing.area_gross) : null
  const listingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shtepi.al'}/${locale}/listings/${slug}`

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const isNew = new Date(listing.created_at) > sevenDaysAgo
  const isPriceReduced = listing.price_old && listing.price < listing.price_old

  const features = [
    listing.rooms && { icon: Home, label: t('rooms'), value: listing.rooms },
    listing.bedrooms && { icon: BedDouble, label: t('bedrooms'), value: listing.bedrooms },
    listing.bathrooms && { icon: Bath, label: t('bathrooms'), value: listing.bathrooms },
    listing.toilets && { icon: Bath, label: t('toilets'), value: listing.toilets },
    listing.area_gross && { icon: Maximize2, label: t('area_gross_label'), value: `${listing.area_gross} m²` },
    listing.area_net && { icon: Maximize2, label: t('area_net'), value: `${listing.area_net} m²` },
    listing.floor && { icon: Layers, label: t('floor'), value: listing.total_floors ? `${listing.floor} / ${listing.total_floors}` : listing.floor },
    listing.year_built && { icon: CalendarDays, label: t('year_built'), value: listing.year_built },
  ].filter(Boolean) as { icon: any; label: string; value: any }[]

  const details = [
    listing.condition && { label: t('condition_label'), value: t(`condition_${listing.condition}` as any) },
    listing.heating && { label: t('heating_label'), value: t(`heating_${listing.heating}` as any) },
    listing.wall_type && { label: t('wall_type_label'), value: t(`wall_${listing.wall_type}` as any) },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="pb-24 lg:pb-8">
      {/* Breadcrumbs */}
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">{t('back_to_listings').split(' ')[0]}</Link>
            <span>/</span>
            <Link href={`/${locale}/listings`} className="hover:text-foreground transition-colors">{t('all_listings')}</Link>
            {listing.location && (<><span>/</span><Link href={`/${locale}/listings?location_id=${listing.location.id}`} className="hover:text-foreground transition-colors">{listing.location.name_al}</Link></>)}
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-8 min-w-0">

            {/* Gallery */}
            <ListingGallery images={images} title={listing.title} />

            {/* Title + price + badges */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {isNew && <Badge className="bg-badge-new text-primary-foreground">{t('new')}</Badge>}
                {listing.is_premium && <Badge className="bg-badge-premium text-primary-foreground">{t('premium')}</Badge>}
                {isPriceReduced && <Badge className="bg-badge-reduced text-primary-foreground">{t('price_reduced')}</Badge>}
                <Badge variant="outline">{t(listing.listing_type as any)}</Badge>
                <Badge variant="outline">{t(`property_type_${listing.property_type}` as any)}</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{listing.title}</h1>

              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-primary">{formatPrice(listing.price, listing.currency)}</span>
                {isPriceReduced && <span className="text-lg text-muted-foreground line-through">{formatPrice(listing.price_old!, listing.currency)}</span>}
                {pricePerSqm && <span className="text-sm text-muted-foreground">{formatPrice(pricePerSqm, listing.currency)}/{t('per_sqm').split('/')[1] ?? 'm²'}</span>}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {listing.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location.name_al}</span>
                )}
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.views_count} {t('views')}</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Key features grid */}
            {features.length > 0 && (
              <div className="rounded-2xl border bg-card shadow-sm p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {features.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon className="h-3.5 w-3.5" />{label}</span>
                      <span className="font-semibold text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="rounded-2xl border bg-card shadow-sm p-5">
                <h2 className="font-bold text-lg mb-3">{t('description_label')}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Additional details */}
            {details.length > 0 && (
              <div className="rounded-2xl border bg-card shadow-sm p-5">
                <h2 className="font-bold text-lg mb-4">{t('amenities_label')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {details.map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {listing.lat && listing.lng && (
              <div className="rounded-2xl border bg-card shadow-sm p-5">
                <h2 className="font-bold text-lg mb-4">{t('location_label')}</h2>
                <MapWrapper lat={listing.lat} lng={listing.lng} title={listing.title} />
              </div>
            )}

            {/* Report */}
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <Flag className="h-3.5 w-3.5" />
                {t('report_listing')}
              </button>
            </div>

            {/* Similar listings */}
            <SimilarListings
              currentId={listing.id}
              propertyType={listing.property_type}
              locationId={listing.location?.id ?? null}
            />
          </div>

          {/* ── Right column: contact sidebar ── */}
          {owner && (
            <ListingContact
              owner={owner}
              listingTitle={listing.title}
              listingUrl={listingUrl}
              price={listing.price}
              currency={listing.currency}
            />
          )}
        </div>
      </div>
    </div>
  )
}
