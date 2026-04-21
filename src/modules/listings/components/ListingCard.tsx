'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, BedDouble, Bath, Maximize2, Layers, Camera, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: any
  variant?: 'vertical' | 'horizontal'
}

function getBadges(listing: any) {
  const badges: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }[] = []
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if (new Date(listing.created_at) > sevenDaysAgo) {
    badges.push({ label: 'new', variant: 'default', className: 'bg-badge-new hover:bg-badge-new/90 text-primary-foreground' })
  }
  if (listing.is_premium) {
    badges.push({ label: 'premium', variant: 'default', className: 'bg-badge-premium hover:bg-badge-premium/90 text-primary-foreground' })
  }
  if (listing.price_old && listing.price < listing.price_old) {
    badges.push({ label: 'price_reduced', variant: 'default', className: 'bg-badge-reduced hover:bg-badge-reduced/90 text-primary-foreground' })
  }
  return badges
}

function formatPrice(price: number, currency: string) {
  const formatter = new Intl.NumberFormat('sq-AL', { maximumFractionDigits: 0 })
  return `${formatter.format(price)} ${currency}`
}

export function ListingCard({ listing, variant = 'vertical' }: ListingCardProps) {
  const t = useTranslations('listing')
  const locale = useLocale()
  const badges = getBadges(listing)

  const coverImage = listing.images?.find((img: any) => img.is_cover) || listing.images?.[0]
  const imageCount = listing.images?.length ?? 0
  const pricePerSqm = listing.area_gross && listing.area_gross > 0
    ? Math.round(listing.price / listing.area_gross)
    : null
  const locationName = listing.location?.name_al ?? ''

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/${locale}/listings/${listing.slug}`}
        className="group flex gap-3 rounded-xl border bg-card hover:shadow-md transition-shadow overflow-hidden"
        data-track="listing_click"
      >
        {/* Image */}
        <div className="relative w-32 shrink-0 sm:w-44">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, 176px"
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <Maximize2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map(b => (
              <Badge key={b.label} className={cn('text-[10px] px-1.5 py-0', b.className)}>
                {t(b.label as any)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between py-3 pr-3 flex-1 min-w-0">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t(listing.listing_type as any)} · {t((`property_type_${listing.property_type}`) as any)}
            </p>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-base font-bold text-primary">{formatPrice(listing.price, listing.currency)}</span>
              {listing.price_old && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(listing.price_old, listing.currency)}</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
              {listing.rooms && <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{listing.rooms}</span>}
              {listing.area_gross && <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" />{listing.area_gross} m²</span>}
              {locationName && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{locationName}</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/${locale}/listings/${listing.slug}`}
      className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      data-track="listing_click"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Maximize2 className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {badges.map(b => (
            <Badge key={b.label} className={cn('text-[10px] px-1.5 py-0', b.className)}>
              {t(b.label as any)}
            </Badge>
          ))}
        </div>

        {/* Photo count bottom-right */}
        {imageCount > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-overlay/60 text-overlay-foreground text-xs px-2 py-0.5 rounded-full">
            <Camera className="h-3 w-3" />
            {imageCount}
          </div>
        )}

        {/* Favorite button */}
        <button
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 hover:bg-card flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
          aria-label="Add to favorites"
          data-track="add_favorite"
        >
          <Heart className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        {/* Type label */}
        <p className="text-xs text-muted-foreground">
          {t(listing.listing_type as any)} · {t((`property_type_${listing.property_type}`) as any)}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(listing.price, listing.currency)}</span>
            {listing.price_old && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(listing.price_old, listing.currency)}</span>
            )}
          </div>
          {pricePerSqm && (
            <span className="text-xs text-muted-foreground">{formatPrice(pricePerSqm, '')} {t('per_sqm')}</span>
          )}
        </div>

        {/* Features row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-2">
          {listing.rooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {listing.rooms}
            </span>
          )}
          {listing.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {listing.bathrooms}
            </span>
          )}
          {listing.area_gross && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {listing.area_gross} m²
            </span>
          )}
          {listing.floor && (
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {listing.floor}
            </span>
          )}
        </div>

        {/* Location + date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {locationName && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {locationName}
            </span>
          )}
          <span className="ml-auto">
            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  )
}
