'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ListingsFilters } from '@/modules/listings/components/ListingsFilters'
import { ListingsSortBar } from '@/modules/listings/components/ListingsSortBar'
import { ListingsPagination } from '@/modules/listings/components/ListingsPagination'
import { ListingCard } from '@/modules/listings/components/ListingCard'
import { Skeleton } from '@/components/ui/skeleton'
import { LISTINGS_PER_PAGE } from '@/modules/listings/constants'

interface Location {
  id: number
  name_al: string
  type: string
}

interface Props {
  listings: any[]
  total: number
  page: number
  locations: Location[]
  activeFiltersCount: number
}

export function ListingsShell({ listings, total, page, locations, activeFiltersCount }: Props) {
  const t = useTranslations('listing')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="flex gap-8">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 rounded-2xl border bg-card shadow-sm p-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <ListingsFilters locations={locations} />
        </div>
      </aside>

      {/* ── Mobile filters sheet ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[90vw] bg-card shadow-xl overflow-y-auto">
            <div className="p-5">
              <ListingsFilters
                locations={locations}
                onClose={() => setFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-0">
        <ListingsSortBar
          total={total}
          page={page}
          perPage={LISTINGS_PER_PAGE}
          view={view}
          onViewChange={setView}
          onFiltersOpen={() => setFiltersOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('no_results_title')}</h3>
              <p className="text-muted-foreground text-sm mt-1">{t('no_results_desc')}</p>
            </div>
          </div>
        ) : (
          <>
            <div className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pt-5'
                : 'flex flex-col gap-3 pt-5'
            }>
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant={view === 'list' ? 'horizontal' : 'vertical'}
                />
              ))}
            </div>

            <ListingsPagination
              total={total}
              page={page}
              perPage={LISTINGS_PER_PAGE}
            />
          </>
        )}
      </div>
    </div>
  )
}
